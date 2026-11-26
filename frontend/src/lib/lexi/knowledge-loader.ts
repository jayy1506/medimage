import fs from "fs";
import path from "path";
import crypto from "crypto";
import { embedQuery } from "./gemini-pool";

export interface KnowledgeChunk {
  id: string;
  file: string;
  section: string;
  text: string;
  embedding: number[];
}

export interface SearchResult {
  file: string;
  section: string;
  text: string;
  similarity: number;
}

interface CacheFile {
  hash: string;
  chunks: KnowledgeChunk[];
}

let memoryChunks: KnowledgeChunk[] | null = null;

function getKnowledgeDir(): string {
  const candidateDirs = [
    path.join(process.cwd(), "frontend", "knowledge"),
    path.join(process.cwd(), "knowledge"),
    path.join(process.cwd(), "..", "knowledge"),
  ];

  for (const dir of candidateDirs) {
    if (fs.existsSync(dir) && fs.statSync(dir).isDirectory()) {
      return dir;
    }
  }

  return path.join(process.cwd(), "knowledge");
}

function getCachePath(): string {
  return path.join(process.cwd(), ".knowledge-cache.json");
}

function computeKnowledgeHash(dir: string): string {
  if (!fs.existsSync(dir)) return "";
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md")).sort();
  const hash = crypto.createHash("sha256");
  for (const f of files) {
    const content = fs.readFileSync(path.join(dir, f), "utf8");
    hash.update(f + ":" + content);
  }
  return hash.digest("hex");
}

function chunkMarkdown(file: string, content: string): Omit<KnowledgeChunk, "id" | "embedding">[] {
  const lines = content.split("\n");
  const chunks: Omit<KnowledgeChunk, "id" | "embedding">[] = [];

  let currentSection = "General";
  let buffer: string[] = [];

  const flushBuffer = () => {
    const text = buffer.join("\n").trim();
    if (text.length > 0) {
      // Chunk into ~400 characters with ~50 overlap
      const chunkSize = 400;
      const overlap = 50;
      let start = 0;
      while (start < text.length) {
        const slice = text.slice(start, start + chunkSize).trim();
        if (slice.length > 20) {
          chunks.push({
            file,
            section: currentSection,
            text: slice,
          });
        }
        start += chunkSize - overlap;
      }
    }
    buffer = [];
  };

  for (const line of lines) {
    const headerMatch = line.match(/^#{1,4}\s+(.*)/);
    if (headerMatch) {
      flushBuffer();
      currentSection = headerMatch[1].trim();
    } else {
      buffer.push(line);
    }
  }

  flushBuffer();
  return chunks;
}

export async function getKnowledgeChunks(): Promise<KnowledgeChunk[]> {
  if (memoryChunks && memoryChunks.length > 0) {
    return memoryChunks;
  }

  const knowledgeDir = getKnowledgeDir();
  const cachePath = getCachePath();
  const currentHash = computeKnowledgeHash(knowledgeDir);

  // Check cache file
  if (fs.existsSync(cachePath)) {
    try {
      const cachedData: CacheFile = JSON.parse(fs.readFileSync(cachePath, "utf8"));
      if (cachedData.hash === currentHash && Array.isArray(cachedData.chunks) && cachedData.chunks.length > 0) {
        memoryChunks = cachedData.chunks;
        return memoryChunks;
      }
    } catch {
      // ignore corrupted cache
    }
  }

  // Build chunks from markdown files
  if (!fs.existsSync(knowledgeDir)) {
    return [];
  }

  const files = fs.readdirSync(knowledgeDir).filter((f) => f.endsWith(".md")).sort();
  const rawChunks: Omit<KnowledgeChunk, "id" | "embedding">[] = [];

  for (const f of files) {
    const content = fs.readFileSync(path.join(knowledgeDir, f), "utf8");
    rawChunks.push(...chunkMarkdown(f, content));
  }

  // Embed chunks sequentially to respect rate limits
  const embeddedChunks: KnowledgeChunk[] = [];
  for (let i = 0; i < rawChunks.length; i++) {
    const raw = rawChunks[i];
    const textToEmbed = `${raw.file} - ${raw.section}: ${raw.text}`;
    try {
      const embedding = await embedQuery(textToEmbed);
      embeddedChunks.push({
        id: `chunk-${i}`,
        file: raw.file,
        section: raw.section,
        text: raw.text,
        embedding,
      });
      // Small pause between embeddings
      if (i % 5 === 0) {
        await new Promise((r) => setTimeout(r, 100));
      }
    } catch (e) {
      console.error(`Failed to embed chunk ${i} (${raw.file}):`, e);
    }
  }

  // Save to cache
  try {
    const cacheData: CacheFile = {
      hash: currentHash,
      chunks: embeddedChunks,
    };
    fs.writeFileSync(cachePath, JSON.stringify(cacheData), "utf8");
  } catch (err) {
    console.error("Failed to write knowledge cache file:", err);
  }

  memoryChunks = embeddedChunks;
  return memoryChunks;
}

function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length || a.length === 0) return 0;
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

export async function searchKnowledge(
  query: string,
  topK = 5,
  minSimilarity = 0.55
): Promise<SearchResult[]> {
  const chunks = await getKnowledgeChunks();
  if (chunks.length === 0) return [];

  const queryEmbedding = await embedQuery(query);
  const scored: SearchResult[] = [];

  for (const chunk of chunks) {
    const sim = cosineSimilarity(queryEmbedding, chunk.embedding);
    if (sim >= minSimilarity) {
      scored.push({
        file: chunk.file,
        section: chunk.section,
        text: chunk.text,
        similarity: sim,
      });
    }
  }

  scored.sort((a, b) => b.similarity - a.similarity);
  return scored.slice(0, topK);
}
