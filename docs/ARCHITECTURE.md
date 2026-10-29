# System Architecture Specification

**Project:** Medical Text and Image Processing Learning Platform (AIDS 12605.1)  
**Institution:** Faculty of Engineering and Technology (FET), DMIHER  
**Status:** Approved for Implementation  

---

## 1. High-Level System Architecture (C4 Model)

```mermaid
graph TD
    subgraph Client Tier [Client-Side Browser]
        UI[Next.js 14 React UI & Tailwind/shadcn]
        Pyodide[In-Browser Pyodide WASM Sandbox\nNumPy, OpenCV, pydicom]
        WasmViewer[Client-Side Image Playground & DICOM Explorer]
    end

    subgraph Identity & Edge [Free Identity & CDN Edge]
        FirebaseAuth[Firebase Authentication\nEmail/Password + Custom Claims]
        Cloudflare[Cloudflare Edge CDN\nAssets & Caching]
    end

    subgraph Compute Services [Hosted Free Services]
        NextServer[Next.js App Router BFF / API Routes\nHosted on Vercel Free Tier]
        FastAPIServer[FastAPI Microservice (Python 3.11)\nHosted on Render/Railway Free Tier\npydicom, OpenCV, sentence-transformers]
        UpstashRedis[Upstash Redis (Serverless)\nRate Limiting & Semantic Query Cache]
    end

    subgraph Data & Storage Tier [Hosted Single Source of Truth]
        SupabaseDB[(Supabase PostgreSQL 15 + pgvector)\nUsers, Audit, Syllabus, Questions, Attempts]
        SupabaseStorage[Supabase Object Storage\nApproved Visuals & Public Sample DICOMs]
    end

    subgraph External Free AI Tier
        Gemini[Google Gemini 1.5 Flash API\nCourse AI Tutor & Quiz Generator]
        GroqFallback[Groq Cloud Free API\nLlama 3.3 70B Fallback]
    end

    %% Interactions
    UI -->|1. Auth Sign-In| FirebaseAuth
    UI -->|2. Page & API Requests with Bearer Token| NextServer
    UI -->|3. Client-Side Python Execution| Pyodide
    UI -->|4. Interactive Sliders & Canvas Manipulation| WasmViewer

    NextServer -->|Verify Firebase Token| FirebaseAuth
    NextServer -->|Proxy Auth & DB Reads| SupabaseDB
    NextServer -->|Cache Check & Rate Limit| UpstashRedis
    NextServer -->|Heavy Image/Vector Tasks| FastAPIServer

    FastAPIServer -->|Query Vector Embeddings| SupabaseDB
    FastAPIServer -->|RAG Grounded Prompt| Gemini
    FastAPIServer -.->|Quota Exceeded Fallback| GroqFallback

    SupabaseStorage -->|Serve Static Medical Assets| Cloudflare
    Cloudflare --> UI
```

---

## 2. Technology Stack Selection & Rationale

| Layer | Selected Technology | Alternative Considered | Detailed Rationale & Trade-off |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | **Next.js 14+ (App Router, React 18, TypeScript)** | Vite + React SPA | Next.js App Router provides Server Components (RSC) for fast initial load of heavy curriculum content, SEO optimization for academic indexing, and built-in Edge API route handlers. |
| **Styling & Components** | **Tailwind CSS + shadcn/ui** | Vanilla CSS / Material UI | Radix-primitive accessible components (shadcn) styled with Tailwind CSS tokens matching DMIHER FET branding. Zero runtime CSS overhead. |
| **Backend Service** | **FastAPI (Python 3.11)** | Pure Node.js Express | Medical imaging libraries (`pydicom`, `scikit-image`, `opencv-python`, `nibabel`) are native to Python. Embedding generation via `sentence-transformers` runs seamlessly in Python. |
| **Code Execution Sandbox** | **Pyodide (WebAssembly in Browser)** | Docker Sandbox on AWS/Render | **Zero server cost, zero security risk.** Pyodide executes student Python code (`numpy`, `pydicom`, `cv2`) directly on client CPU/RAM in an isolated WASM sandbox. No container breakouts, no compute bill. |
| **Hosted Database** | **Supabase (PostgreSQL 15 + pgvector)** | Neon / Local SQLite | Supabase provides hosted PostgreSQL with full `pgvector` support for semantic vector search, connection pooling (PgBouncer), strict Row Level Security (RLS), and zero local storage footprint. |
| **Object Storage** | **Supabase Storage** | Cloudinary / AWS S3 | Free 1GB bucket for faculty-approved SVGs, compressed WebP diagrams, and public educational sample DICOM files. Native integration with Supabase Postgres. |
| **Cache & Rate Limiting** | **Upstash Redis** | Local in-memory cache | Stateless, serverless Redis with REST API. Free tier allows 10,000 requests/day to strictly enforce rate limits per student and cache frequent AI Tutor queries. |
| **Auth Provider** | **Firebase Auth (Spark Free Plan)** | Supabase Auth / Auth0 | Email/password login with custom claims (`role: student | faculty | admin`). High reliability, zero self-signup vulnerabilities when configured via Firebase Admin SDK. |
| **AI LLM Engine** | **Google Gemini 1.5 Flash (Free Tier)** | OpenAI GPT-4o mini | Gemini 1.5 Flash offers 1,500 free requests/day with large context windows for multi-topic syllabus reasoning. Groq Llama 3.3 70B acts as immediate zero-cost fallback. |

---

## 3. Strict "No Local Storage" Enforcement

Per project rules defined in `AGENTS.md`, the platform enforces strict statelessness on the host server:
1. **No Local SQLite / JSON files:** No `.db`, `.sqlite`, or JSON course files are read or written on the server.
2. **Single Hosted Source of Truth:** All syllabus topics, diagrams, quiz banks, user progress, and audit logs reside in the hosted Supabase PostgreSQL instance.
3. **Seed & Migration Discipline:** Database schemas and seed data are managed through reproducible SQL migration scripts pushed directly to the remote hosted database.
4. **Browser Storage Policy:** LocalStorage and SessionStorage are restricted solely to Firebase Auth session tokens managed by the official Firebase SDK. No curriculum or progress data is stored in the browser storage.

---

## 4. Repository & Directory Structure

```
E-Learning/
├── .github/
│   └── workflows/
│       ├── frontend-ci.yml           # Vitest, Next.js lint, build test
│       └── backend-ci.yml            # Pytest, flake8, mypy
├── docs/                             # Phase 1 Documentation suite
│   ├── PRD.md
│   ├── DESIGN.md
│   ├── ARCHITECTURE.md
│   ├── DATABASE.md
│   ├── API.md
│   ├── AI_AGENTS.md
│   ├── AUTH.md
│   ├── MCP.md
│   ├── FEATURES.md
│   ├── CONTENT.md
│   ├── PLAN.md
│   ├── SETUP.md
│   ├── TESTING.md
│   ├── DEBUGGING.md
│   └── README.md
├── frontend/                         # Next.js 14 App Router Project
│   ├── public/
│   │   ├── assets/
│   │   │   ├── logo.svg              # DMIHER FET Brand Logo
│   │   │   └── favicon.ico
│   │   └── samples/                  # Public anonymized demo DICOMs
│   ├── src/
│   │   ├── app/
│   │   │   ├── (auth)/login/
│   │   │   ├── (dashboard)/
│   │   │   ├── course/[moduleId]/[topicSlug]/
│   │   │   ├── playground/
│   │   │   ├── assessments/
│   │   │   ├── faculty/
│   │   │   └── admin/
│   │   ├── components/
│   │   │   ├── ui/                   # shadcn/ui components
│   │   │   ├── topic/                # Dual-panel interactive viewer
│   │   │   ├── diagrams/             # Mermaid & interactive SVG renderers
│   │   │   ├── playground/           # Client-side image canvas & sliders
│   │   │   ├── sandbox/              # Pyodide WebAssembly editor & runner
│   │   │   └── tutor/                # Grounded AI Chat Assistant
│   │   ├── lib/
│   │   │   ├── firebase.ts           # Client Firebase initialization
│   │   │   ├── pyodide.ts            # Pyodide worker lifecycle manager
│   │   │   └── api-client.ts         # Axios/Fetch wrapper with JWT
│   │   └── types/
│   ├── package.json
│   └── tsconfig.json
├── backend/                          # FastAPI Python Microservice
│   ├── app/
│   │   ├── core/
│   │   │   ├── config.py             # Env settings & Free-tier thresholds
│   │   │   ├── firebase_admin.py     # Token verification & custom claims
│   │   │   └── rate_limiter.py       # Upstash Redis rate limiting
│   │   ├── api/
│   │   │   ├── v1/
│   │   │   │   ├── auth.py           # Admin user invite & CSV endpoints
│   │   │   │   ├── course.py         # Modules, topics, and syllabus tree
│   │   │   │   ├── assessments.py    # Quizzes, retakes, 75% pass rule
│   │   │   │   ├── tutor.py          # RAG pipeline with Gemini & MiniLM
│   │   │   │   ├── faculty.py        # Visual approval & grading overrides
│   │   │   │   └── image_ops.py      # Server-side verification tools
│   │   ├── db/
│   │   │   ├── session.py            # Async SQLAlchemy / asyncpg
│   │   │   └── migrations/           # Alembic migration scripts
│   │   ├── models/                   # SQLAlchemy ORM models
│   │   ├── schemas/                  # Pydantic v2 validation models
│   │   └── services/
│   │       ├── rag_service.py        # pgvector retrieval + prompt assembly
│   │       └── dicom_service.py      # pydicom inspection
│   ├── tests/
│   ├── requirements.txt
│   └── Dockerfile
└── scripts/
    ├── seed_database.py              # Idempotent database seeder
    └── bootstrap_admin.py            # Initial super-admin creation CLI
```

---

## 5. End-to-End Data Flows

### 5.1 Admin Provisioning Flow
1. Admin uploads CSV of 70–200 students with fields: `email`, `first_name`, `last_name`, `student_id`.
2. Backend loops through entries via `firebase-admin` SDK: creates user, sets custom claim `role='student'`.
3. Backend sends password-setup email link via Firebase Auth.
4. Backend inserts mirrored record into hosted PostgreSQL `users` table with `status='pending_first_login'`.
5. Action is recorded in the PostgreSQL `audit_logs` table.

### 5.2 Interactive Topic Learning & Dynamic Synchronization Flow
1. Student navigates to `/course/module-3/dicom`.
2. Next.js fetches syllabus topic data, sections, and approved SVG/Mermaid diagram definitions from PostgreSQL via API.
3. Left panel renders technical explanations, mathematical formulations, and clinical relevance.
4. An `IntersectionObserver` watches left-panel section boundaries. When Section 4 (`DICOM Tag Structure`) enters viewport, the right sticky panel updates to the interactive DICOM tag hierarchy tree.
5. Clicking a node in the right diagram highlights the corresponding paragraph and code block in the left panel.

### 5.3 Pyodide In-Browser Coding Sandbox Flow
1. Student opens a practice coding challenge (e.g., "Calculate Hounsfield Units from raw CT attenuation coefficients").
2. Browser web worker initializes Pyodide, pre-loading `numpy` and `pydicom` wheels cached in browser memory.
3. Student writes Python code in the Monaco/CodeMirror editor and clicks **"Run Tests"**.
4. Pyodide executes the student function against 3 hidden test cases in the local browser sandbox.
5. If all test assertions pass, a cryptographic signature / submission token is sent to the backend to award completion credit. Zero server CPU is consumed.
