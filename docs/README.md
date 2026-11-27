# Medical Text and Image Processing Interactive Learning Platform
### Course: AIDS 12605.1 (B.Tech Semester VI)
### Faculty of Engineering and Technology, Adani Institute of Higher Education and Research (Deemed to be University)

[![Platform Status](https://img.shields.io/badge/Milestones%200--7-Fully%20Implemented-brightgreen.svg)](PLAN.md)
[![Access Control](https://img.shields.io/badge/Access-Invite--Only%20(RBAC)-blue.svg)](AUTH.md)
[![Zero Local Storage](https://img.shields.io/badge/Storage-Hosted%20DB%20Only%20(Supabase)-orange.svg)](DATABASE.md)
[![100% Free Tier](https://img.shields.io/badge/Infrastructure-100%25%20Free%20Tier-success.svg)](PRD.md)
[![Next.js 14](https://img.shields.io/badge/Frontend-Next.js%2014%20(App%20Router)-black.svg)](../frontend)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI%20Python-009688.svg)](../backend)
[![Pyodide Sandbox](https://img.shields.io/badge/Sandbox-Pyodide%20WebAssembly-yellowgreen.svg)](FEATURES.md)
[![AI Tutor](https://img.shields.io/badge/AI%20Guide-Lexi%20v2.0%20(Claude--Style)-blueviolet.svg)](AI_AGENTS.md)

---

## 1. Overview & Vision

The **Medical Text and Image Processing Interactive Learning Platform** is an institutional-grade, specialized learning system engineered specifically for the undergraduate course **AIDS 12605.1 (B.Tech Semester VI)** at the Faculty of Engineering and Technology (FET), Adani Institute of Higher Education and Research.

The platform bridges foundational biomedical physics, clinical diagnostic workflows, computer vision, and healthcare NLP by providing students with hands-on, synchronous visual tools, real-time client-side algorithmic sandboxes, and curriculum-grounded AI tutoring—with zero cloud compute costs and strict zero-local-storage persistence.

---

## 2. Institutional Branding & Visual Identity

- **Institution:** Faculty of Engineering and Technology (FET)
- **University:** Adani Institute of Higher Education and Research (Deemed to be University)
- **Department:** Artificial Intelligence and Data Science (AIDS)
- **Official Brand Colors:**
  - **Adani Cyan:** `#0077B6` (Primary brand accent, from 'a' in adani logo)
  - **Adani Royal Purple:** `#662D91` (Mid-gradient tone)
  - **Adani Magenta:** `#B82662` (Brand ruby tone, from 'i' in adani logo)
  - **Academic Navy:** `#0B2545` (Primary interface contrast and header)
  - **Institutional Gold:** `#D4AF37` (Badges, mastery achievements)
  - **Clinical Slate:** `#090D16` / `#131B2E` (High-contrast medical dark theme)
- **Official Logo:** Embedded across top navigation bars, authentication portals, and favicon.

---

## 3. Architecture at a Glance

```
Next.js 14 (App Router) + Tailwind CSS + shadcn/ui
  ├── Dual-Panel Interactive Viewer (KaTeX + Mermaid.js + Interactive SVGs)
  ├── Client-Side Image Playgrounds & Missions (Canvas + WebAssembly)
  ├── In-Browser Pyodide Sandbox (NumPy, OpenCV, pydicom)
  └── Lexi Academic AI Guide v2.0 (Claude-Style UI, 3 Display Modes)
        │
        ▼ (HTTPS REST / Bearer JWT)
FastAPI Python Microservice (Render Free Tier / Unified Container)
  ├── Firebase Admin Token Verification & RBAC
  ├── Upstash Redis Persistent Roster, Dynamic Progress & Semantic Caching
  └── RAG Service (MiniLM + pgvector / Gemini Multi-Key Pool)
        │
        ▼ (Connection Pooler Port 6543)
Supabase Hosted PostgreSQL 15 + pgvector + Supabase Storage
  └── Single Source of Truth (Zero Local Database Files)
```

---

## 4. Documentation Index (`/docs`)

For exhaustive architectural, technical, and operational specifications, consult the documents below:

1. [PRD.md](PRD.md) — Comprehensive product requirements, user roles, free-tier limits, and upgrade paths.
2. [DESIGN.md](DESIGN.md) — Institutional branding tokens, layout specifications, and Lexi Claude-style design system.
3. [ARCHITECTURE.md](ARCHITECTURE.md) — C4 architecture diagrams, microservice boundaries, unified Render deployment, and zero-local-storage enforcement.
4. [DATABASE.md](DATABASE.md) — PostgreSQL 15 DDL, Upstash Redis key schema, `pgvector` indexing, schema relations, and RLS policies.
5. [API.md](API.md) — RESTful OpenAPI specifications, response schemas, and rate-limiting limits.
6. [AI_AGENTS.md](AI_AGENTS.md) — Lexi Academic AI Guide v2.0, RAG prompt architecture, multi-key pool, and clinical refusal rules.
7. [AUTH.md](AUTH.md) — Invite-only authentication, custom claims, Redis-backed roster with auto-deduplication, and admin audit logging.
8. [FEATURES.md](FEATURES.md) — Interactive playgrounds, diagnostic missions, bioimage pipeline builder, mini-games, and Pyodide sandbox.
9. [CONTENT.md](CONTENT.md) — Full curriculum breakdown across all 6 modules (45 hours) + Capstone assessment.
10. [PLAN.md](PLAN.md) — Milestones 0 through 7 execution history, completed tasks, and GSD checklists.
11. [SETUP.md](SETUP.md) — Step-by-step developer environment setup, local multi-process execution, and seed runbook.
12. [TESTING.md](TESTING.md) — Pytest, Vitest, Lexi 40-case evaluation suite, Playwright E2E, and concurrency test suites.
13. [DEBUGGING.md](DEBUGGING.md) — Incident troubleshooting runbook, common failure recovery, and diagnostic steps.
14. [DEPLOYMENT_RENDER.md](DEPLOYMENT_RENDER.md) — Production deployment guide for unified single-service Docker containers on Render free tier.
15. [MCP.md](MCP.md) — Model Context Protocol integration guidelines (Supabase Postgres, GitHub, Filesystem).

---

## 5. Quick Start (Development)

Follow the detailed instructions in [SETUP.md](SETUP.md):

```bash
# 1. Install root dependencies
npm install

# 2. Run both FastAPI backend (port 8000) and Next.js frontend (port 3000)
npm run dev
```

Visit **[http://localhost:3000](http://localhost:3000)** to access the platform.
