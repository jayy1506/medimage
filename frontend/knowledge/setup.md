# System Architecture & Development Setup

## Technology Stack Overview
- **Frontend:**
  - Next.js 14 (App Router, React 18, TypeScript)
  - Tailwind CSS with Adani University branding (`adani` and `clinical` color palettes)
  - KaTeX for mathematical equation rendering ($...$, $$...$$)
  - Lucide React for UI iconography
  - HTML5 Canvas & WebAssembly for 60 FPS real-time image processing
  - Pyodide (WebAssembly) for client-side Python execution (`numpy`, `opencv-python`, `pydicom`)
  - `@google/genai` with server-side API key pool and SSE streaming for Lexi AI Tutor
- **Backend:**
  - FastAPI (Python 3.11+, Pydantic v2, Uvicorn)
  - Assessment anti-cheating validation and mission score verification
  - REST endpoints on port 8000
- **Database & Semantic Caching:**
  - Hosted Supabase (PostgreSQL) with `pgvector` for course curriculum embeddings
  - Upstash Redis Serverless REST API for query caching and fast response caching
- **Zero Local Storage Compliance:**
  - No local SQLite database files or unencrypted patient records stored on disk.

## Local Development Execution
The repository includes a unified process orchestrator (`dev.js`):
```bash
npm run dev
```
This single command:
1. Launches the FastAPI backend on `http://127.0.0.1:8000`.
2. Validates backend readiness via health check (`/health`).
3. Launches the Next.js frontend on `http://localhost:3000`.

## Health Check Endpoints
- **Backend Health:** `GET http://127.0.0.1:8000/health` returns `{"status":"ok"}`.
- **Frontend Health:** `GET http://localhost:3000/api/health` returns `{"ok":true}`.
