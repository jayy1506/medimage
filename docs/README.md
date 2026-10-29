# Medical Text and Image Processing Interactive Learning Platform
### Course: AIDS 12605.1 (B.Tech Semester VI)
### Faculty of Engineering and Technology (FET), Datta Meghe Institute of Higher Education & Research (DMIHER)

[![Phase 1 Docs](https://img.shields.io/badge/Phase%201-Docs%20Complete-green.svg)](#)
[![Access Control](https://img.shields.io/badge/Access-Invite--Only-blue.svg)](#)
[![Zero Local Storage](https://img.shields.io/badge/Storage-Hosted%20DB%20Only-orange.svg)](#)
[![100% Free Tier](https://img.shields.io/badge/Cost-100%25%20Free%20Tier-success.svg)](#)

---

## 1. Overview

This platform is a dedicated, high-performance interactive learning environment built specifically for the **Medical Text and Image Processing (AIDS 12605.1)** undergraduate curriculum at DMIHER FET.

### Key Capabilities:
- **Synchronized Dual-Panel Topic Pages:** Conceptual explanations on the left dynamically trigger and control interactive diagrams and visual workstations on the right.
- **Client-Side Image Playgrounds:** Interactive CT windowing/leveling, 2D convolution filters, histogram equalization, Otsu thresholding, and Fourier transform viewers operating 100% in the browser.
- **In-Browser Pyodide Sandbox:** Hands-on Python coding exercises using `numpy`, `opencv-python`, and `pydicom` executing securely in client WebAssembly with zero server compute expense.
- **Curriculum-Grounded AI Tutor:** Real-time conversational assistant powered by Google Gemini 1.5 Flash (with Groq fallback), grounded strictly in approved syllabus embeddings with diagram node highlights and citation links.
- **Strict Invite-Only Security:** Zero public registration. Firebase Auth custom claims paired with hosted PostgreSQL row-level security.
- **Strict Mastery Rule (>75%):** Module assessments require $> 75\%$ to clear, with randomized question bank pulls, best vs. latest attempt tracking, and faculty grading overrides.

---

## 2. Institutional Branding & Visual Identity

- **Institution:** Faculty of Engineering and Technology (FET), DMIHER
- **Official Brand Colors:**
  - **Academic Navy:** `#0B2545` (Primary interface and header)
  - **Institutional Gold:** `#D4AF37` (Badges, accents, highlights)
  - **Clinical Cyan:** `#0284C7` (Diagnostic imaging scans and filters)
  - **Diagnostic Slate:** `#0F172A` / `#090D16` (High-contrast medical dark theme)
- **Official Logo:** Embedded across the top navigation bar, authentication portal, and favicon.

---

## 3. Architecture at a Glance

```
Next.js 14 (App Router) + Tailwind CSS + shadcn/ui
  ├── Dual-Panel Interactive Viewer (KaTeX + Mermaid.js + Interactive SVGs)
  ├── Client-Side Playground (Canvas + WebAssembly)
  └── In-Browser Pyodide Sandbox (NumPy, OpenCV, pydicom)
        │
        ▼ (HTTPS REST / Bearer JWT)
FastAPI Python Microservice (Render / Railway Free Tier)
  ├── Firebase Admin Token Verification & RBAC
  ├── Upstash Redis Caching & Rate Limiting
  └── RAG Service (sentence-transformers MiniLM + pgvector)
        │
        ▼ (Connection Pooler Port 6543)
Supabase Hosted PostgreSQL 15 + pgvector + Supabase Storage
  └── Single Source of Truth (Zero Local Database Files)
```

---

## 4. Documentation Index (`/docs`)

All architecture, database, API, and curriculum specifications have been authored and approved in `/docs`:

1. [PRD.md](file:///c:/Users/jthak/OneDrive/Attachments/Desktop/E-Learning/docs/PRD.md): Product requirements, stakeholders, user stories, free-tier limits, and upgrade path.
2. [DESIGN.md](file:///c:/Users/jthak/OneDrive/Attachments/Desktop/E-Learning/docs/DESIGN.md): Design tokens, DMIHER FET branding, dual-panel layout, interactive diagram specs.
3. [ARCHITECTURE.md](file:///c:/Users/jthak/OneDrive/Attachments/Desktop/E-Learning/docs/ARCHITECTURE.md): C4 system models, technology choices, zero-local-storage enforcement.
4. [DATABASE.md](file:///c:/Users/jthak/OneDrive/Attachments/Desktop/E-Learning/docs/DATABASE.md): PostgreSQL schemas with `pgvector`, 15 tables, indexes, and RLS policies.
5. [API.md](file:///c:/Users/jthak/OneDrive/Attachments/Desktop/E-Learning/docs/API.md): RESTful OpenAPI endpoints, schemas, authentication, and rate limiting.
6. [AI_AGENTS.md](file:///c:/Users/jthak/OneDrive/Attachments/Desktop/E-Learning/docs/AI_AGENTS.md): RAG pipeline, prompts, clinical refusal guardrails, diagram referencing.
7. [AUTH.md](file:///c:/Users/jthak/OneDrive/Attachments/Desktop/E-Learning/docs/AUTH.md): Invite-only architecture, Firebase custom claims, admin bootstrap, audit logs.
8. [MCP.md](file:///c:/Users/jthak/OneDrive/Attachments/Desktop/E-Learning/docs/MCP.md): Model Context Protocol integration (Postgres, GitHub, Filesystem).
9. [FEATURES.md](file:///c:/Users/jthak/OneDrive/Attachments/Desktop/E-Learning/docs/FEATURES.md): Detailed specifications for interactive demos, DICOM viewer, and assessments.
10. [CONTENT.md](file:///c:/Users/jthak/OneDrive/Attachments/Desktop/E-Learning/docs/CONTENT.md): Complete curriculum outline across all 6 modules (45 hours) + Medical NLP.
11. [PLAN.md](file:///c:/Users/jthak/OneDrive/Attachments/Desktop/E-Learning/docs/PLAN.md): Milestone execution plan, GSD task checklists, and verification tests.
12. [SETUP.md](file:///c:/Users/jthak/OneDrive/Attachments/Desktop/E-Learning/docs/SETUP.md): Environment variables (`.env.example`), installation, run, and seed instructions.
13. [TESTING.md](file:///c:/Users/jthak/OneDrive/Attachments/Desktop/E-Learning/docs/TESTING.md): Vitest, Pytest, Playwright E2E, AI evals, and 200+ concurrency tests.
14. [DEBUGGING.md](file:///c:/Users/jthak/OneDrive/Attachments/Desktop/E-Learning/docs/DEBUGGING.md): Incident runbook, common failure recovery, and diagnostic steps.

---

## 5. Quick Start (Development)

Follow the detailed instructions in [SETUP.md](file:///c:/Users/jthak/OneDrive/Attachments/Desktop/E-Learning/docs/SETUP.md):

```bash
# 1. Setup Backend
cd backend
python -m venv venv
source venv/bin/activate  # or .\venv\Scripts\activate on Windows
pip install -r requirements.txt
python ../scripts/bootstrap_admin.py
python ../scripts/seed_database.py
uvicorn app.main:app --reload --port 8000

# 2. Setup Frontend
cd ../frontend
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the platform.
