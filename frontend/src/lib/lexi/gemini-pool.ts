import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import path from "path";

function loadEnvLocalIfNeeded() {
  if (process.env.GEMINI_API_KEYS) return;
  const candidatePaths = [
    path.join(process.cwd(), ".env.local"),
    path.join(process.cwd(), "frontend", ".env.local"),
    path.join(__dirname, "..", "..", "..", ".env.local"),
  ];

  for (const envPath of candidatePaths) {
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, "utf8");
      for (const line of content.split("\n")) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
          const idx = trimmed.indexOf("=");
          const key = trimmed.slice(0, idx).trim();
          const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
          if (!process.env[key]) {
            process.env[key] = val;
          }
        }
      }
      break;
    }
  }
}

let cachedClients: GoogleGenAI[] | null = null;
let roundRobinIndex = 0;

function getClients(): GoogleGenAI[] {
  if (cachedClients && cachedClients.length > 0) {
    return cachedClients;
  }

  loadEnvLocalIfNeeded();

  const envKeys = process.env.GEMINI_API_KEYS || process.env.GEMINI_API_KEY || "";
  const keys = envKeys.split(",").map((k) => k.trim()).filter(Boolean);
  if (keys.length === 0) {
    throw new Error("No GEMINI_API_KEYS configured on server");
  }

  cachedClients = keys.map((apiKey) => new GoogleGenAI({ apiKey }));
  return cachedClients;
}

export function getClientPoolSize(): number {
  return getClients().length;
}

export async function withGeminiRetry<T>(
  action: (client: GoogleGenAI, keyIndex: number) => Promise<T>
): Promise<T> {
  const clients = getClients();
  const maxAttempts = Math.max(clients.length, 3);
  let lastError: any = null;

  // Advance base round-robin pointer on each request
  const startIndex = roundRobinIndex;
  roundRobinIndex = (roundRobinIndex + 1) % clients.length;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const currentIndex = (startIndex + attempt) % clients.length;
    const client = clients[currentIndex];

    try {
      const result = await action(client, currentIndex);
      return result;
    } catch (err: any) {
      lastError = err;
      const status = err.status || err.code || err.statusCode || (err.error && err.error.code);
      const isRetryable =
        status === 429 ||
        status === 500 ||
        status === 502 ||
        status === 503 ||
        status === 504 ||
        /quota|rate limit|overloaded|resource exhausted/i.test(err.message || "");

      if (isRetryable && attempt < maxAttempts - 1) {
        const delayMs = Math.min(Math.pow(2, attempt) * 150, 1000);
        await new Promise((res) => setTimeout(res, delayMs));
        continue;
      }
      throw err;
    }
  }

  throw lastError || new Error("Gemini pool retry exhausted");
}

export async function embedQuery(text: string): Promise<number[]> {
  return withGeminiRetry(async (client) => {
    const res = await client.models.embedContent({
      model: "gemini-embedding-001",
      contents: text.slice(0, 2048),
    });
    const values = res.embeddings?.[0]?.values;
    if (!values || values.length === 0) {
      throw new Error("Empty embedding received from Gemini");
    }
    return values;
  });
}
