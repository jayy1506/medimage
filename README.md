# Medical Text and Image Processing Interactive Learning Platform
### Course: AIDS 12605.1 (B.Tech Semester VI)
### Faculty of Engineering and Technology, Adani Institute of Higher Education and Research (Deemed to be University)

[![Platform Status](https://img.shields.io/badge/Milestones%200--6-Fully%20Implemented-brightgreen.svg)](docs/PLAN.md)
[![Access Control](https://img.shields.io/badge/Access-Invite--Only%20(RBAC)-blue.svg)](docs/AUTH.md)
[![Zero Local Storage](https://img.shields.io/badge/Storage-Hosted%20DB%20Only%20(Supabase)-orange.svg)](docs/DATABASE.md)
[![100% Free Tier](https://img.shields.io/badge/Infrastructure-100%25%20Free%20Tier-success.svg)](docs/PRD.md)
[![Next.js 14](https://img.shields.io/badge/Frontend-Next.js%2014%20(App%20Router)-black.svg)](frontend)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI%20Python-009688.svg)](backend)
[![Pyodide Sandbox](https://img.shields.io/badge/Sandbox-Pyodide%20WebAssembly-yellowgreen.svg)](docs/FEATURES.md)
[![AI Tutor](https://img.shields.io/badge/AI%20Tutor-Gemini%201.5%20Flash%20%2B%20pgvector-blueviolet.svg)](docs/AI_AGENTS.md)

---

## 1. Overview & Vision

The **Medical Text and Image Processing Interactive Learning Platform** is an institutional-grade, specialized learning system engineered specifically for the undergraduate course **AIDS 12605.1 (B.Tech Semester VI)** at the Faculty of Engineering and Technology (FET), Adani Institute of Higher Education and Research.

The platform bridges foundational biomedical physics, clinical diagnostic workflows, computer vision, and healthcare NLP by providing students with hands-on, synchronous visual tools, real-time client-side algorithmic sandboxes, and curriculum-grounded AI tutoring—with zero cloud compute costs and strict zero-local-storage persistence.

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                   Interactive Dual-Panel Academic Environment                    │
├─────────────────────────────────────────┬────────────────────────────────────────┤
│ LEFT: Conceptual & Mathematical Theory  │ RIGHT: Interactive Visual Workstation  │
│ • Clinical motivation & anatomy         │ • Live CT Window/Level (WW/WL) sliders │
│ • Rigorous KaTeX mathematical formulas  │ • Interactive 2D Convolution kernels   │
│ • Step-by-step diagnostic workflows     │ • Frequency Domain (FFT) filters       │
│ • Worked clinical case studies          │ • Privacy-First DICOM Tag Explorer     │
│ • Formative quick checks                │ • Dynamic Mermaid & SVG Flowcharts     │
└─────────────────────────────────────────┴────────────────────────────────────────┘
```

---

## 2. Key Capabilities & Platform Highlights

### 🖥️ Synchronized Dual-Panel Topic Engine
- **144 Detailed Slide Units** covering all 6 syllabus modules with rich academic math formatting via KaTeX.
- **Scroll-Synchronized Visuals:** As students advance through clinical theory on the left, the sticky right panel dynamically syncs corresponding interactive diagrams, flowcharts, or algorithmic workstations via `IntersectionObserver`.
- **Interactive Mermaid & SVG Diagrams:** Node-level click-to-explain interactions, highlight synchronization with equations in the left panel, and zoom/pan inspection.

### 🔬 Client-Side Interactive Image Processing Playgrounds
All image processing algorithms execute 100% in client WebAssembly / HTML5 Canvas with sub-16ms latency (60 FPS) and zero backend server load:
1. **CT Window Width / Window Level (WW/WL):** Real-time linear contrast mapping with standard clinical presets (Brain: $W=80, L=40$, Bone: $W=2000, L=500$, Lung: $W=1500, L=-600$, Soft Tissue: $W=350, L=50$) and Hounsfield Unit (HU) live probe.
2. **2D Spatial Convolution & Histogram Equalization:** Live $3 \times 3$ kernel grid (Sobel X/Y, Gaussian Blur, Laplacian, Sharpen, Edge Detect) with custom weights, step-by-step pixel convolution visualizers, and real-time CDF-based histogram equalization.
3. **2D Fast Fourier Transform (FFT) & Frequency Masking:** Real-time spatial-to-frequency transformation, low-pass/high-pass filter masks, and inverse FFT reconstruction demonstrating artifact removal.
4. **Medical Image Segmentation:** Real-time Otsu global thresholding, interactive region growing with seed point selection, and morphological operations (dilation, erosion, opening, closing).
5. **Privacy-First DICOM Metadata Explorer:** In-browser client parser for standard DICOM tags (`(0010,0010)`, `(0028,0010)`, `(0028,0030)`) on anonymized clinical samples with strict HIPAA de-identification disclaimers and upload blocking.

### 🎮 Interactive Clinical Labs, Missions & Mini-Games
1. **Clinical Diagnostic Missions (`/playground/missions`):**
   - Goal-based challenges with physiological targets:
     - *Mission 1:* Calvarial Bone Fracture Delineation (WL: 400 HU, WW: 1500 HU).
     - *Mission 2:* Acute Subdural Hematoma Contrast (WL: 65 HU, WW: 130 HU).
     - *Mission 3:* Pulmonary Parenchyma & Bullae Isolation (WL: -600 HU, WW: 1500 HU).
     - *Mission 4:* Brain Glioblastoma Otsu Variance Segmentation.
     - *Mission 5:* Periodic RF Moiré Stripe Suppression in 2D Fourier Spectrum.
   - Live target contrast scoring (0–100), 1-to-3 Star rating system, staged physiological hints (-5 pts penalty), and personal best score tracking.
   - Dual client practice scoring + server-side verification (`/api/v1/missions/submit`) to prevent score tampering.

2. **Bioimage Pipeline Builder (`/playground/pipeline`):**
   - Visual sequential block chaining (Gaussian Blur → Otsu Thresholding → Morphological Erode/Dilate → Measure Area & Centroid).
   - Live intermediate canvas thumbnail previews at each stage, mirroring Fiji / Bioimage workflows.
   - One-click **"Export Equivalent Python Script"** generating production-ready Python code with `cv2`, `numpy`, and `scipy.ndimage`.

3. **"See the Math" Micro-Inspectors:**
   - **Neighborhood Pixel Inspector:** Hover any pixel to view its 3×3 patch, kernel matrix weights, element-wise products, and discrete convolution sum ($K \ast I$).
   - **Curtain Compare Slider:** Interactive split divider allowing students to slide between raw medical scan and convolved response.
   - **Live 256-Bin Intensity Histogram:** Real-time distribution visualization with mean ($\mu$), standard deviation ($\sigma$), and threshold markers.

4. **Clinical Mini-Games Hub (`/playground/games`):**
   - **Filter Match:** Clinical case diagnosis matching optimal filters (Median vs. Gaussian vs. Unsharp Mask) for detector impulse noise, Poisson quantum mottle, and speckle.
   - **Spot the Artifact:** Identify Beam Hardening, Motion Ghosting, Phase Aliasing, and Detector Ring Artifacts with physics explanations.
   - **2D Fourier Frequency Mask Studio:** Draw circular Low-Pass, High-Pass, or Notch rejection masks on the 2D k-space power spectrum and observe real-time inverse FFT spatial synthesis.
   - **MRI Spin-Echo Contrast Simulator:** Interactive TR (300–4000 ms) and TE (10–150 ms) sliders calculating $S = \rho(1 - e^{-TR/T_1})e^{-TE/T_2}$ to visually morph between T1-weighted, T2-weighted, and Proton Density contrast.

5. **Restrained Institutional Rewards & Gamification:**
   - **Competency Badges:** Hounsfield Calibrator, Pipeline Architect, Fourier Sorcerer, Artifact Sleuth, Otsu Optimizer, Clinical Dedication.
   - **Daily Challenge & Streaks:** Daily clinical task for bonus XP with active streak counter.
   - **Anonymized Class Leaderboard:** Displays privacy-preserving student aliases (e.g., `Roentgen-07`, `Curie-42`, `Hounsfield-99`) toggleable by faculty.

### 🐍 In-Browser Pyodide WebAssembly Coding Sandbox
- Zero-cost client-side Python execution environment powered by **Pyodide (WebAssembly)**.
- Pre-loaded with scientific computing packages (`numpy`, `opencv-python`, `pydicom`).
- Embedded coding exercises with automated test assertions, execution output consoles, and automated code grading without requiring external cloud sandbox servers.

### 🧠 Curriculum-Grounded AI Tutor (RAG + pgvector)
- **Model:** Google Gemini 1.5 Flash (Primary) with automated failover to Groq Llama 3.3 70B if quota boundaries are approached.
- **Knowledge Base:** Vectorized course syllabus, lecture units, and clinical notes embedded using `sentence-transformers/all-MiniLM-L6-v2` and stored in Supabase `pgvector`.
- **Redis Semantic Cache:** Upstash Redis cache for common student queries to reduce LLM quota consumption by $>40\%$.
- **Clinical Refusal Guardrails:** Strict system-level prompt enforcement refusing clinical diagnosis, patient prescriptions, or emergency advice, firmly keeping queries focused on academic theory and computational imaging methods.
- **Node-Linked Citations:** Responses cite specific syllabus topics and trigger highlight states on relevant interactive diagram nodes.

### 🎯 Assessment Engine & Strict >75% Mastery Rule
- **Randomized Question Bank:** 15 MCQs per module (90 questions) + 40-question comprehensive Capstone Exam (130 questions total) tagged with Course Outcomes (CO1–CO6) and Bloom's taxonomy levels.
- **Strict Mastery Pass Mark:** Module clearance strictly requires $> 75\%$ score. Scores $\le 75\%$ trigger structured remediation guidance, pointing to specific slide units.
- **Dual Score Tracking:** Tracks both **Best Score** (for mastery record) and **Latest Attempt** (for trend analysis) in PostgreSQL.
- **Anti-Cheating:** Answer keys and explanations are validated strictly server-side on FastAPI; no answer keys are ever exposed in client bundles or network payloads.

### 🛡️ Invite-Only Authentication & RBAC Governance
- **Zero Public Registration:** No public signup routes exist.
- **Role-Based Access Control (RBAC):** Firebase custom claims (`student`, `faculty`, `admin`) verified on every FastAPI request and mirrored in the hosted PostgreSQL `users` table.
- **Faculty Studio:** Content review and visual asset approval dashboard, grading overrides, and class analytics.
- **Admin Management Portal:** Single and bulk CSV student/faculty invitation generator, account activation tracking, status toggles, and immutable audit logging.

---

## 3. Curriculum Syllabus & Course Structure

### Course: AIDS 12605.1 — Medical Text and Image Processing (45 Hours)

| Module | Title | Hours | Key Topics & Algorithms | Interactive Workstations |
| :---: | :--- | :---: | :--- | :--- |
| **M1** | **Introduction to Medical Imaging Modalities** | 8 | Physics of X-Ray, CT Radon transform, MRI T1/T2 relaxation, Ultrasound Doppler, PET/SPECT, DICOM standard | DICOM Explorer, CT Window/Level Simulator |
| **M2** | **Image Enhancement & Filtering** | 8 | Spatial domain transforms, Histogram Equalization, 2D convolution, Homomorphic filtering, High-pass/Low-pass | 2D Spatial Convolution, Histogram Equalizer, 2D FFT |
| **M3** | **Medical Image Segmentation** | 8 | Otsu thresholding, Region growing, Watershed, Active Contours (Snakes), Level Sets, Dice/Jaccard metrics | Interactive Otsu & Region Growing Playground |
| **M4** | **Feature Extraction & Pattern Recognition** | 7 | GLCM texture matrices, Haralick features, Morphological operations, Wavelet decomposition, ROC/AUC analysis | Morphological Inspector, GLCM Matrix Explorer |
| **M5** | **Deep Learning in Medical Imaging** | 8 | CNNs for medical scans, U-Net architecture, Skip connections, Transfer learning, Grad-CAM interpretability | U-Net Layer-by-Layer Flowchart, Grad-CAM Heatmap Viewer |
| **M6** | **Medical Text Processing & Multimodal AI** | 6 | Clinical NLP tokenization, BioBERT/ClinicalBERT, Radiology report summarization, EHR NER, Vision-Language models | Clinical NLP Entity Highlighter, Multimodal Architecture Viewer |
| **CAP** | **Comprehensive Capstone Assessment** | — | 40-question multi-topic timed exam spanning CO1 through CO6 | Timed Exam Runner with Review & Retake Analytics |

---

## 4. Technical Architecture

```
                                  [ STUDENT / FACULTY BROWSER ]
                                                │
                     ┌──────────────────────────┴──────────────────────────┐
                     ▼                                                     ▼
         [ Next.js 14 App Router ]                               [ Pyodide WebAssembly ]
         • Dual-Panel Slide Engine (KaTeX)                       • Client Python Runner
         • HTML5 Canvas Playgrounds (WW/WL, Conv, FFT)           • NumPy, OpenCV, pydicom
         • Mermaid & SVG Interactive Flowcharts                  • Sub-500ms Local Exec
                     │
                     ▼ (HTTPS REST / Bearer JWT)
         [ FastAPI Python Microservice ] ─── (Verify Claims) ───► [ Firebase Admin SDK ]
         • Invite-Only Middleware & RBAC                         • Email/Password Identity
         • Assessments Server-Side Grading                       • Password Reset Links
         • Faculty Approval & Admin Endpoints                    • Custom Claims (`role`)
                     │
         ┌───────────┴─────────────────────────────┐
         ▼                                         ▼
[ Upstash Redis Free Tier ]              [ Supabase Hosted PostgreSQL 15 ]
• RAG Query Semantic Cache               • Single Source of Truth (Zero Local DB)
• Student & Faculty Rate Limiting        • 15 Tables, Strict RLS Policies
• Roster & Session Storage               • pgvector (MiniLM 384-dim Embeddings)
                                         • Audit Logs & Asset Storage
```

### Architectural Guardrails:
1. **Zero Local Storage Rule:** No SQLite files, no persistent local JSON/CSV files, and no on-disk vector stores. All persistent state resides exclusively in hosted Supabase PostgreSQL.
2. **100% Free-Tier Discipline:** Every integrated service utilizes verified free tiers (Vercel, Render/Railway, Supabase, Firebase, Upstash Redis, Gemini API, Groq).
3. **Client-Side Heavy Computation:** Image processing, DICOM parsing, and Python code execution operate client-side in the browser, eliminating high backend compute/GPU infrastructure costs.

---

## 5. Technology Stack & Free-Tier Specifications

| Layer | Technology | Service / Tier | Free Tier Limits | Fallback Strategy |
| :--- | :--- | :--- | :--- | :--- |
| **Frontend** | Next.js 14, React 18, Tailwind CSS, shadcn/ui | Vercel Free Hobby | 100 GB bandwidth / mo | Cloudflare Pages static export |
| **Backend** | FastAPI, Python 3.11, Uvicorn, Pydantic | Render / Railway Free | 750 free instance hours / mo | Keep-alive cron or Railway fallback |
| **Database** | PostgreSQL 15 + `pgvector` extension | Supabase Free Tier | 500 MB DB, 50MB vector pool | Schema pruning & Neon Postgres free |
| **Cache & Limits**| Redis (REST API) | Upstash Redis Free | 10,000 commands / day | In-memory FastAPI LRU cache |
| **Identity / Auth**| Firebase Authentication | Spark Plan (Free) | Unlimited Email/Password | Hosted Supabase Auth fallback |
| **Primary AI** | Google Gemini 1.5 Flash | Google AI Studio Free | 15 RPM, 1M TPM | Groq Llama 3.3 70B failover |
| **Fallback AI**| Llama 3.3 70B Versatile | Groq Cloud Free | 30 RPM, 14.4k RPD | Local rule-based curriculum retrieval |
| **Embeddings** | `sentence-transformers/all-MiniLM-L6-v2` | Local / Backend Py | 384 dimensions, zero cost | Pre-computed static vectors |
| **Code Execution**| Pyodide (Python in WebAssembly) | Client Browser | Zero server compute | Client-side test assertion runner |
| **Monitoring** | Sentry Free Tier | Sentry Developer | 5,000 errors / mo | Backend structured JSON log stream |

---

## 6. Directory Structure

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
│   │   │   ├── roster.py           # Class roster and Redis cache management
│   │   │   └── tutor.py            # Grounded AI tutor endpoint (Gemini + Groq)
│   │   ├── core/                   # Security, Firebase config, CORS, env settings
│   │   ├── db/                     # Supabase PostgreSQL session pooler
│   │   ├── models/                 # SQLAlchemy 2.0 ORM models (15 tables)
│   │   ├── schemas/                # Pydantic validation schemas
│   │   ├── services/               # RAG vector service, Redis cache service
│   │   └── main.py                 # Application factory, Sentry init, route mounting
│   ├── tests/                      # Automated Pytest test suites
│   └── requirements.txt            # Python dependencies
├── docs/                           # System Documentation & Specs
│   ├── AI_AGENTS.md                # RAG pipeline, prompt guardrails, refuse logic
│   ├── API.md                      # OpenAPI specification and rate limits
│   ├── ARCHITECTURE.md             # C4 models, tech choices, free-tier limits
│   ├── AUTH.md                     # Invite-only RBAC, claims, audit log specs
│   ├── CONTENT.md                  # Detailed syllabus breakdown (45 hours)
│   ├── DATABASE.md                 # PostgreSQL 15 DDL, pgvector, RLS policies
│   ├── DEBUGGING.md                # Incident triage and failure recovery
│   ├── DESIGN.md                   # Brand visual tokens, layout specifications
│   ├── FEATURES.md                 # Interactive playgrounds & assessment specs
│   ├── MCP.md                      # Model Context Protocol integrations
│   ├── PLAN.md                     # Milestones 0-6 task checklists & tracking
│   ├── PRD.md                      # Stakeholder user stories & requirements
│   ├── SETUP.md                    # Environment variables & run instructions
│   └── TESTING.md                  # Test matrix, CI workflow, load testing
├── frontend/                       # Next.js 14 App Router Frontend
│   ├── public/                     # Static icons, sample DICOMs, brand assets
│   ├── src/
│   │   ├── app/                    # Next.js routes
│   │   │   ├── (auth)/login/       # Secure email/password login portal
│   │   │   ├── admin/              # User management & audit logs dashboard
│   │   │   ├── course/             # Course modules, slides, and quizzes
│   │   │   ├── course/capstone/    # 40-question comprehensive capstone exam
│   │   │   ├── dashboard/          # Student progress & attainment dashboard
│   │   │   ├── faculty/            # Visual asset review studio & class metrics
│   │   │   ├── playground/         # Interactive image processing workstations
│   │   │   │   ├── convolution/    # 2D spatial convolution & histogram equalization
│   │   │   │   ├── dicom/          # DICOM tag viewer & metadata explorer
│   │   │   │   ├── fourier/        # 2D FFT & frequency domain filter masks
│   │   │   │   ├── segmentation/   # Otsu thresholding & region growing
│   │   │   │   └── windowing/      # CT Window Width/Window Level (WW/WL)
│   │   │   └── tutor/              # RAG-grounded AI Tutor conversational UI
│   │   ├── components/             # Reusable UI, diagrams, topic panels, playgrounds
│   │   ├── context/                # Progress, Auth, and Theme context providers
│   │   ├── data/                   # 144 slide units, curriculum content, quiz DB
│   │   └── lib/                    # Firebase client, Supabase client, utilities
│   ├── package.json
│   └── tailwind.config.ts
├── scripts/                        # Database migrations, seeders, and load test scripts
│   ├── bootstrap_admin.py          # One-time superadmin seed via Firebase Admin
│   ├── load_test_200_users.py      # 200 concurrent student load testing script
│   ├── run_migrations.py           # Hosted PostgreSQL migration executor
│   └── seed_database.py            # Idempotent syllabus & quiz DB seeder
├── AGENTS.md                       # Project agent rules & hard constraints
└── README.md                       # Main project documentation
```

---

## 7. Quick Start & Setup Guide

### Prerequisites
- **Node.js:** v18.18+ or v20+
- **Python:** v3.10+ or v3.11+
- **Supabase Account:** Free hosted PostgreSQL instance with `pgvector` enabled
- **Firebase Project:** Spark (Free) plan with Email/Password Auth enabled
- **Upstash Redis:** Free serverless Redis database
- **Gemini API Key:** Free API key from Google AI Studio (optional: Groq API Key)

### Step 1: Clone the Repository
```bash
git clone https://github.com/jayy1506/medimage.git
cd medimage
```

### Step 2: Configure Environment Variables
Create `.env` in `backend/` and `.env.local` in `frontend/` using the templates provided in [docs/SETUP.md](docs/SETUP.md):

**Backend (`backend/.env`):**
```ini
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:6543/postgres?sslmode=require
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
UPSTASH_REDIS_REST_URL=https://[YOUR-ENDPOINT].upstash.io
UPSTASH_REDIS_REST_TOKEN=your_token
GEMINI_API_KEY=your_gemini_api_key
GROQ_API_KEY=your_groq_api_key
FIRST_ADMIN_EMAIL=admin@adani.edu.in
FIRST_ADMIN_PASSWORD=InitialAdminSecurePassword123!
```

**Frontend (`frontend/.env.local`):**
```ini
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-firebase-project-id
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Step 3: Run Database Migrations & Seeders
```bash
# Set up backend virtual environment
cd backend
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt

# Run migrations to create 15 relational tables in hosted PostgreSQL
python ../scripts/run_migrations.py

# Bootstrap the first superadmin account
python ../scripts/bootstrap_admin.py

# Seed the curriculum (6 modules, topics, slide units, quiz database)
python ../scripts/seed_database.py
```

### Step 4: Launch Backend & Frontend Services
```bash
# Terminal 1: Launch Backend
cd backend
uvicorn app.main:app --reload --port 8000

# Terminal 2: Launch Frontend
cd frontend
npm install
npm run dev
```

Visit **[http://localhost:3000](http://localhost:3000)** in your browser and log in with your bootstrapped credentials.

---

## 8. Verification & Testing Suite

All features adhere to the **Ralph loop** (implement → run tests → inspect errors → fix) and require empirical verification.

```bash
# Run Backend Test Suite (Auth, RBAC, Assessment Grading, RAG Tutor)
cd backend
pytest tests/ -v

# Run Concurrency & Load Testing (Simulating 200 concurrent student sessions)
python ../scripts/load_test_200_users.py
```

### Test Coverage Highlights:
- `backend/tests/test_auth.py`: Validates Firebase token verification, custom claim extraction, unauthenticated 401s, disabled account 403s, and student forbidden barriers on admin routes.
- `backend/tests/test_assessments.py`: Validates server-side grading, answer key stripping from responses, score calculations, and strict mastery thresholding ($74.9\%$ fails, $75.1\%$ passes).
- `backend/tests/test_tutor_and_faculty.py`: Validates RAG prompt clinical refusal guardrails and faculty asset review approvals.
- `scripts/load_test_200_users.py`: Proves $<400$ms $p95$ latency and zero errors across 200 concurrent simulated students within Supabase connection pool limits.

---

## 9. Security, HIPAA, & Clinical Ethics

1. **HIPAA & De-Identification:**
   - The platform strictly handles **anonymized, de-identified synthetic or public domain sample scans**.
   - Client-side DICOM explorer strips patient identification fields and warns users against loading identifiable patient files.
2. **Clinical Safety Guardrails:**
   - The AI Tutor system prompt explicitly forbids providing medical diagnostic advice, patient triage, or prescription drug recommendations.
   - Any query attempting to seek clinical medical opinions receives a standard academic refusal notice with a redirection to qualified medical professionals.
3. **Defense-in-Depth RBAC:**
   - Client route guards prevent students from visiting `/admin` or `/faculty`.
   - FastAPI server dependencies inspect token roles on every API invocation.
   - Supabase Row-Level Security (RLS) ensures students can only read/write their own attempt records and cannot alter grades or syllabus content.

---

## 10. Institutional Information & Accreditation

- **Institution:** Faculty of Engineering and Technology (FET)  
- **University:** Adani Institute of Higher Education and Research (Deemed to be University)  
- **Department:** Artificial Intelligence and Data Science (AIDS)  
- **Course:** Medical Text and Image Processing (`AIDS 12605.1`)  
- **Academic Level:** B.Tech Semester VI  
- **Contact:** `jayy1506@adani.edu.in`

---

## 11. Documentation Index

For exhaustive technical references, inspect the `/docs` directory:
- [PRD.md](docs/PRD.md) — Comprehensive product requirements, stakeholder workflows, and free-tier upgrade paths.
- [DESIGN.md](docs/DESIGN.md) — Institutional branding guidelines, visual tokens, and dual-panel specifications.
- [ARCHITECTURE.md](docs/ARCHITECTURE.md) — C4 architecture diagrams, microservice boundaries, and zero-local-storage enforcement.
- [DATABASE.md](docs/DATABASE.md) — PostgreSQL 15 DDL, `pgvector` indexing, schema relations, and RLS policies.
- [API.md](docs/API.md) — RESTful OpenAPI specifications, response schemas, and rate-limiting limits.
- [AI_AGENTS.md](docs/AI_AGENTS.md) — RAG prompt architecture, Gemini/Groq failover, and clinical refusal rules.
- [AUTH.md](docs/AUTH.md) — Invite-only authentication, custom claims, and admin audit logging.
- [FEATURES.md](docs/FEATURES.md) — Complete specifications for interactive playgrounds and Pyodide sandbox.
- [CONTENT.md](docs/CONTENT.md) — Full curriculum breakdown across all 6 modules (45 hours) + Capstone.
- [PLAN.md](docs/PLAN.md) — Milestones 0 through 6 execution history and GSD checklists.
- [SETUP.md](docs/SETUP.md) — Step-by-step developer deployment and environment configuration guide.
- [TESTING.md](docs/TESTING.md) — Pytest, Vitest, Playwright E2E, and concurrency test suites.
- [DEBUGGING.md](docs/DEBUGGING.md) — Incident troubleshooting runbook and error recovery procedures.

---

*Developed with pride for the Faculty of Engineering and Technology, Adani Institute of Higher Education and Research.*
