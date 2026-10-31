/**
 * Client-Side Resilient Curriculum API Client
 * Single source of truth: Hosted Upstash Redis & FastAPI Backend.
 * Automatically fails over to direct Upstash REST API if localhost proxy is unavailable.
 */

const UPSTASH_URL = process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_URL || "";
const UPSTASH_TOKEN = process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN || "";

async function fetchFromUpstash(key: string): Promise<any | null> {
  try {
    const res = await fetch(`${UPSTASH_URL}/get/${key}`, {
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
      cache: "no-store"
    });
    if (res.ok) {
      const data = await res.json();
      if (data.result) {
        return JSON.parse(data.result);
      }
    }
  } catch (err) {
    console.warn(`[CurriculumApi] Upstash direct fetch failed for ${key}:`, err);
  }
  return null;
}

export async function getModuleDetails(modNum: number = 1) {
  // 1. Try local proxy / backend
  try {
    const apiBase = typeof window !== "undefined" ? "/api/v1" : (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1");
    const res = await fetch(`${apiBase}/curriculum/modules/${modNum}`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      if (data.topics && data.topics.length > 0) {
        return data;
      }
    }
  } catch (e) {
    // Fall through to hosted Upstash Redis
  }

  // 2. Direct hosted Upstash Redis fallback
  const [mod, topics, questions] = await Promise.all([
    fetchFromUpstash(`medimage:curriculum:module:${modNum}`),
    fetchFromUpstash(`medimage:curriculum:topics:m${modNum}`),
    fetchFromUpstash(`medimage:curriculum:questions:m${modNum}`)
  ]);

  return {
    module: mod || {
      id: `mod-${modNum}`,
      module_number: modNum,
      title: "Medical Image Sources",
      hours: 8,
      eqb_co: "CO1"
    },
    topics: topics || [],
    questions_count: questions ? questions.length : 0
  };
}

export async function getModuleQuestions(modNum: number = 1, topicCode?: string) {
  // 1. Try local backend
  try {
    const apiBase = typeof window !== "undefined" ? "/api/v1" : (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1");
    let url = `${apiBase}/curriculum/modules/${modNum}/questions`;
    if (topicCode) url += `?topic_code=${encodeURIComponent(topicCode)}`;
    const res = await fetch(url, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      if (data.questions && data.questions.length > 0) {
        return data.questions;
      }
    }
  } catch (e) {
    // Fall through
  }

  // 2. Direct hosted Upstash Redis fallback
  const questions = (await fetchFromUpstash(`medimage:curriculum:questions:m${modNum}`)) || [];
  if (topicCode) {
    return questions.filter((q: any) => q.topic_code === topicCode);
  }
  return questions;
}

export async function getCurriculumDecisions() {
  try {
    const apiBase = typeof window !== "undefined" ? "/api/v1" : (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1");
    const res = await fetch(`${apiBase}/curriculum/decisions`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      if (data.decisions && data.decisions.length > 0) {
        return data.decisions;
      }
    }
  } catch (e) {}

  return (await fetchFromUpstash("medimage:curriculum:decisions")) || [];
}

export async function getCurriculumAuditLogs() {
  try {
    const apiBase = typeof window !== "undefined" ? "/api/v1" : (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1");
    const res = await fetch(`${apiBase}/curriculum/audit-logs`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      if (data.audit_logs && data.audit_logs.length > 0) {
        return data.audit_logs;
      }
    }
  } catch (e) {}

  return (await fetchFromUpstash("medimage:curriculum:audit_logs")) || [];
}
