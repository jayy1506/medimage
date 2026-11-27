# System Architecture Specification

**Project:** Medical Text and Image Processing Learning Platform (AIDS 12605.1)  
**Institution:** Faculty of Engineering and Technology (FET), Adani Institute of Higher Education and Research (Deemed to be University)  
**Status:** Approved for Implementation  

---

## 1. High-Level System Architecture (C4 Model)

```mermaid
graph TD
    subgraph Client Tier [Client-Side Browser]
        UI[Next.js 14 React UI & Tailwind/shadcn]
        Pyodide[In-Browser Pyodide WASM Sandbox\nNumPy, OpenCV, pydicom]
        WasmViewer[Client-Side Image Playgrounds & DICOM Explorer\nWW/WL, Conv, FFT, Otsu, Missions]
        LexiUI[Lexi AI Guide v2.0 Claude-Style UI\n3 Display Modes: Normal, Half, Full]
    end

    subgraph Identity & Edge [Free Identity & CDN Edge]
        FirebaseAuth[Firebase Authentication\nEmail/Password + Custom Claims]
        Cloudflare[Cloudflare Edge CDN\nAssets & Caching]
    end

    subgraph Compute Services [Unified Hosted Free Deployment - Render]
        NextServer[Next.js 14 App Router Standalone Server\nPort 10000 - SSR, UI, Lexi Proxy]
        FastAPIServer[FastAPI Microservice Python 3.11\nLoopback 127.0.0.1:8000 - Auth, Assessments, RAG]
        KeepAlive[Anti-Sleep Background Heartbeat\nPings /health every 10 min]
    end

    subgraph Data & Storage Tier [Hosted Single Source of Truth]
        SupabaseDB[(Supabase PostgreSQL 15 + pgvector)\nUsers, Syllabus, Diagrams, Questions, Attempts]
        SupabaseStorage[Supabase Object Storage\nApproved Visuals & Public Sample DICOMs]
        UpstashRedis[Upstash Redis Serverless REST\nRoster Storage, Dynamic Progress, Query Cache]
    end

    subgraph External Free AI Tier
        Gemini[Google Gemini API Multi-Key Pool\nGemini 1.5 Flash / Flash-Lite]
        GroqFallback[Groq Cloud Free API\nLlama 3.3 70B Fallback]
    end

    %% Interactions
    UI -->|1. Auth Sign-In| FirebaseAuth
    UI -->|2. Page & API Requests| NextServer
    UI -->|3. Client-Side Python Execution| Pyodide
    UI -->|4. Interactive Workstations & Missions| WasmViewer
    UI -->|5. Conversational RAG Queries| LexiUI

    NextServer -->|Proxy /api/v1/* internally| FastAPIServer
    NextServer -->|Lexi RAG & Embeddings| Gemini
    FastAPIServer -->|Verify Firebase Claims| FirebaseAuth
    FastAPIServer -->|Query & Persist Relations| SupabaseDB
    FastAPIServer -->|Cache Check, Roster, Progress| UpstashRedis
    FastAPIServer -->|RAG Grounded Prompt| Gemini
    FastAPIServer -.->|Quota Exceeded Fallback| GroqFallback

    SupabaseStorage -->|Serve Static Medical Assets| Cloudflare
    Cloudflare --> UI
    KeepAlive -->|Ping| NextServer
```

---

## 2. Technology Stack Selection & Rationale

| Layer | Selected Technology | Alternative Considered | Detailed Rationale & Trade-off |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | **Next.js 14+ (App Router, React 18, TypeScript)** | Vite + React SPA | Server Components (RSC) for fast initial load of heavy curriculum content, built-in API proxying, and seamless SSR. |
| **Styling & Components** | **Tailwind CSS + shadcn/ui** | Vanilla CSS / Material UI | Radix-primitive accessible components styled with Adani Institute institutional branding tokens (Adani Cyan `#0077B6`, Navy `#0B2545`, Magenta `#B82662`). Zero runtime CSS overhead. |
| **Backend Service** | **FastAPI (Python 3.11)** | Pure Node.js Express | Medical imaging libraries (`pydicom`, `scikit-image`, `opencv-python`) and embedding generation via `sentence-transformers` execute natively in Python. |
| **Deployment Model** | **Unified Single-Service Docker on Render** | Separate Vercel + Render | Co-locates Next.js frontend (port 10000) and FastAPI backend (port 8000) in one container on Render's 100% free tier. Zero CORS issues, ultra-low internal loopback latency, and keep-alive ping preventing inactivity sleep. |
| **Code Execution Sandbox** | **Pyodide (WebAssembly in Browser)** | Docker Sandbox on AWS/Render | **Zero server cost, zero security risk.** Pyodide executes student Python code (`numpy`, `pydicom`, `cv2`) directly on client hardware in an isolated WASM sandbox. No container breakouts, no compute bill. |
| **Hosted Database** | **Supabase (PostgreSQL 15 + pgvector)** | Neon / Local SQLite | Supabase provides hosted PostgreSQL with full `pgvector` support for semantic vector search, connection pooling (port 6543), strict Row Level Security (RLS), and zero local storage footprint. |
| **Object Storage** | **Supabase Storage** | Cloudinary / AWS S3 | Free 1GB bucket for faculty-approved SVGs, compressed WebP diagrams, and public educational sample DICOM files. Native integration with Supabase Postgres. |
| **Cache, Roster & Progress** | **Upstash Redis (Serverless REST)** | Local in-memory cache | Stateless, serverless Redis with REST API. Handles student roster syncing, dynamic progress tracking, rate limiting, and semantic query caching. |
| **Auth Provider** | **Firebase Auth (Spark Free Plan)** | Supabase Auth / Auth0 | Email/password login with custom claims (`role: student | faculty | admin`). High reliability, zero self-signup vulnerabilities when configured via Firebase Admin SDK. |
| **AI LLM Engine** | **Google Gemini API (Multi-Key Pool)** | OpenAI GPT-4o mini | Gemini 1.5 Flash provides fast responses and large context. Managed with a server-side multi-key pool with exponential backoff on rate limits. Groq Llama 3.3 70B acts as immediate zero-cost fallback. |

---

## 3. Strict "No Local Storage" Enforcement

Per project rules defined in `AGENTS.md`, the platform enforces strict statelessness on the host server:
1. **No Local SQLite / JSON files:** No `.db`, `.sqlite`, or JSON course files are read or written on the server.
2. **Single Hosted Source of Truth:** All syllabus topics, diagrams, quiz banks, user progress, and audit logs reside in the hosted Supabase PostgreSQL instance and Upstash Redis.
3. **Seed & Migration Discipline:** Database schemas and seed data are managed through reproducible SQL migration scripts pushed directly to the remote hosted database.
4. **Browser Storage Policy:** LocalStorage and SessionStorage are restricted solely to Firebase Auth session tokens managed by the official Firebase SDK. No curriculum or progress data is stored in browser storage.

---

## 4. Repository & Directory Structure

```
E-Learning/
├── assets/                         # Institutional brand assets (Adani logo, banners)
├── backend/                        # FastAPI Python Microservice
│   ├── app/
│   │   ├── api/v1/                 # Versioned REST API routes
│   │   │   ├── admin.py            # User onboarding, CSV bulk import, audit logs
│   │   │   ├── assessments.py      # Quiz serving, server grading, >75% rule
│   │   │   ├── auth.py             # Session verification and role introspection
│   │   │   ├── course.py           # Curriculum modules, topic content, slides
│   │   │   ├── curriculum.py       # Learning objectives & syllabus hierarchy
│   │   │   ├── faculty.py          # Asset approval studio, grade overrides
│   │   │   ├── missions.py         # Clinical diagnostic mission verification & scores
│   │   │   ├── roster.py           # Upstash Redis persistent roster management
│   │   │   └── tutor.py            # Grounded AI tutor endpoint (Gemini + Groq)
│   │   ├── core/                   # Security, Firebase config, CORS, env settings
│   │   ├── db/                     # Supabase PostgreSQL session pooler
│   │   ├── models/                 # SQLAlchemy 2.0 ORM models (15 tables)
│   │   ├── schemas/                # Pydantic validation schemas
│   │   ├── services/               # RAG vector service, Redis cache service
│   │   └── main.py                 # Application factory, Sentry init, keep-alive heartbeat
│   ├── tests/                      # Automated Pytest test suites
│   └── requirements.txt            # Python dependencies
├── docs/                           # System Documentation & Specifications
│   ├── AI_AGENTS.md                # RAG pipeline, Lexi v2.0, prompt guardrails
│   ├── API.md                      # OpenAPI specification, endpoints, rate limits
│   ├── ARCHITECTURE.md             # C4 models, tech choices, free-tier limits
│   ├── AUTH.md                     # Invite-only RBAC, claims, audit log specs
│   ├── CONTENT.md                  # Detailed syllabus breakdown (45 hours + Capstone)
│   ├── DATABASE.md                 # PostgreSQL 15 DDL, pgvector, RLS policies
│   ├── DEBUGGING.md                # Incident triage and failure recovery
│   ├── DEPLOYMENT_RENDER.md        # Unified Docker single-service deployment
│   ├── DESIGN.md                   # Brand visual tokens, layout specifications
│   ├── FEATURES.md                 # Interactive playgrounds, missions, sandbox specs
│   ├── MCP.md                      # Model Context Protocol integrations
│   ├── PLAN.md                     # Milestones 0-7 execution history and checklists
│   ├── PRD.md                      # Stakeholder user stories & requirements
│   ├── README.md                   # System documentation index
│   ├── SETUP.md                    # Environment variables & run instructions
│   └── TESTING.md                  # Test matrix, CI workflow, load testing
├── frontend/                       # Next.js 14 App Router Frontend
│   ├── public/                     # Static icons, sample DICOMs, brand assets
│   ├── src/
│   │   ├── app/                    # Next.js routes
│   │   │   ├── (auth)/login/       # Secure email/password login portal
│   │   │   ├── admin/              # User management & audit logs dashboard
│   │   │   ├── course/             # Course modules, slides, and quizzes
│   │   │   │   ├── [moduleId]/     # Module overview & topics
│   │   │   │   │   └── [topicSlug]/# Synchronized dual-panel topic engine
│   │   │   │   └── capstone/       # 40-question comprehensive capstone exam
│   │   │   ├── dashboard/          # Student progress & attainment dashboard
│   │   │   ├── faculty/            # Visual asset review studio & class metrics
│   │   │   ├── help/               # User help & platform FAQ
│   │   │   ├── lexi/               # Fullscreen Lexi Academic AI Guide page
│   │   │   ├── playground/         # Interactive image processing workstations
│   │   │   │   ├── convolution/    # 2D spatial convolution & histogram equalization
│   │   │   │   ├── dicom/          # DICOM tag viewer & metadata explorer
│   │   │   │   ├── fourier/        # 2D FFT & frequency domain filter masks
│   │   │   │   ├── games/          # Clinical mini-games hub
│   │   │   │   ├── missions/       # 5 Clinical diagnostic missions with scoring
│   │   │   │   ├── pipeline/       # Bioimage visual pipeline builder
│   │   │   │   ├── segmentation/   # Otsu thresholding & region growing
│   │   │   │   └── windowing/      # CT Window Width/Window Level (WW/WL)
│   │   │   └── tutor/              # RAG-grounded AI Tutor conversational UI
│   │   ├── components/             # Reusable UI, diagrams, topic panels, Lexi v2.0
│   │   ├── context/                # Auth, Progress, Gamification, LexiChat context
│   │   ├── data/                   # 144 slide units, curriculum content, quiz DB
│   │   ├── eval/                   # Lexi automated evaluation suite (40 test cases)
│   │   ├── knowledge/              # 7 RAG knowledge documentation modules
│   │   ├── lib/                    # Firebase client, imaging engine, Lexi helpers
│   │   └── styles/                 # Lexi Claude-style theme & styling tokens
│   ├── package.json
│   └── tailwind.config.ts
├── knowledge/                      # Canonical RAG knowledge modules for AI Tutor
├── scripts/                        # Database migrations, seeders, and load test scripts
├── dev.js                          # Unified local development orchestrator (Node.js)
├── build.js                        # Unified Docker build script
├── start-platform.js               # Multi-process production supervisor
├── Dockerfile                      # Production multi-stage Docker build
├── render.yaml                     # Render infrastructure-as-code blueprint
├── AGENTS.md                       # Project agent rules & hard constraints
└── README.md                       # Main project documentation
```

---

## 5. End-to-End Data Flows

### 5.1 Admin Provisioning Flow
1. Admin enters single user details or uploads a CSV file of students/faculty from laptop.
2. System automatically deduplicates entries against existing roster emails.
3. System provisions the account in Firebase Auth, assigns default role claims (`student`), and stores the record in Upstash Redis and PostgreSQL with persistent `active` status.
4. Default temporary password (`Feat@123`) is set; password reset email can be dispatched directly to the student's institutional inbox.
5. All administrative actions are recorded in the Redis audit log and PostgreSQL `audit_logs` table.

### 5.2 Interactive Topic Learning & Dynamic Synchronization Flow
1. Student navigates to `/course/m1/m1-t3-computed-tomography`.
2. Next.js loads topic slide units, mathematical equations (KaTeX), and interactive diagram definitions.
3. Left panel renders conceptual theory, mathematical physics, and clinical case studies.
4. An `IntersectionObserver` watches left-panel section boundaries. When Section 4 (`Radon Transform & Projection`) enters the viewport, the right sticky panel updates to the interactive Radon-to-Backprojection diagram or CT Window/Level slider.
5. Clicking a node in the right diagram highlights the corresponding equation and clinical concept in the left panel.

### 5.3 Pyodide In-Browser Coding Sandbox Flow
1. Student opens a practice coding challenge (e.g., "Calculate Hounsfield Units from raw CT attenuation coefficients").
2. Browser web worker initializes Pyodide, pre-loading `numpy` and `pydicom` wheels cached in browser memory.
3. Student writes Python code in the code editor and clicks **"Run Tests"**.
4. Pyodide executes the student function against hidden test assertions in the local browser sandbox.
5. If assertions pass, completion credit is recorded. Zero server CPU is consumed.

### 5.4 Lexi Academic AI Guide v2.0 RAG Flow
1. Student asks a conceptual question (e.g. "How does T1 relaxation differ from T2 in MRI?").
2. Fast Scope Gate classifies the query as `project`, `off_topic`, or `greeting`, while screening for prompt injection.
3. Query embedding is computed via `gemini-embedding-001` and matched against the 7 knowledge modules using vector cosine similarity.
4. System prompt + retrieved chunks + student prompt are sent via SSE streaming to Gemini 1.5 Flash using the rotating multi-key pool.
5. Response renders in real-time in an editorial Claude-style layout with clickable citation cards and exact topic references.
