# Project Execution Plan & Milestones

**Project:** Medical Text and Image Processing Learning Platform (AIDS 12605.1)  
**Institution:** Faculty of Engineering and Technology (FET), DMIHER  
**Execution Workflow:** Get Shit Done (GSD), Ralph Loop (Iterate until tests & lint pass), No Local Storage, 100% Free-Tier Discipline.  
**Status:** Approved for Implementation  

---

## Milestone 0: Environment Setup, Database Migrations & Admin Bootstrap
*Estimated Duration: 1 Day*

- [x] **Task 0.1: Project Directory Structure & Git Initialization**
  - Scaffold `frontend/` (Next.js 14 App Router, Tailwind CSS, TypeScript) and `backend/` (FastAPI Python).
  - Configure `.gitignore` ensuring zero `.env` or service keys are ever committed.
  - Verification: `git status` shows clean tracking; no secrets staged.
- [x] **Task 0.2: Institutional Branding & Assets**
  - Integrate official Adani Institute of Higher Education and Research logo at `/assets/logo.png` and `/frontend/public/assets/logo.png`.
  - Configure color tokens and typography in Tailwind config.
  - Verification: Logo displays sharply on header and login screens in browser.
- [x] **Task 0.3: Hosted PostgreSQL Database Migrations (Supabase)**
  - Authored SQL migration creating all 15 relational tables, ENUM types, and RLS policies defined in `DATABASE.md` (`scripts/migrations/001_initial_schema.sql`).
  - Idempotent migration runner script authored (`scripts/run_migrations.py`).
  - Verification: DDL verified with pgvector extension and single source of truth rules.
- [x] **Task 0.4: First-Admin Bootstrap CLI Script**
  - Developed `scripts/bootstrap_admin.py` to seed the first super-admin via Firebase Admin SDK and hosted PostgreSQL `users` table.
  - Verification: Script creates admin in Firebase and Postgres; subsequent runs exit safely without duplicate insertion.

---

## Milestone 1: Invite-Only Authentication & RBAC Engine
*Estimated Duration: 1.5 Days*

- [x] **Task 1.1: Firebase Authentication Backend Middleware**
  - Implement FastAPI dependency to verify Firebase Bearer tokens, decode custom claims (`role`), and check active status in Postgres `users` table.
  - Enforce `403 Forbidden` for disabled users or users missing from the database.
  - Verification: Pytest suite validating valid token, expired token, unknown user, and disabled user (`backend/tests/test_auth.py`).
- [x] **Task 1.2: Admin User Management Endpoints**
  - Build `POST /api/v1/admin/users` (single user invite) and `POST /api/v1/admin/users/bulk` (CSV import).
  - Generate Firebase password reset activation links and log actions in `audit_logs`.
  - Verification: Automated test imports 10 mock students from CSV; asserts Firebase accounts and Postgres records created.
- [x] **Task 1.3: Frontend Login & First-Time Password Reset Flow**
  - Build clinical-grade login page (email/password only; zero public signup).
  - Implement force password change workflow on initial login.
  - Add route guards in Next.js middleware redirecting unauthenticated users to `/login`.
  - Verification: Browser agent verifies student cannot bypass login to access `/course`.

---

## Milestone 2: Interactive Dual-Panel Topic Engine
*Estimated Duration: 2 Days*

- [x] **Task 2.1: Idempotent Curriculum Seeder**
  - Develop `scripts/seed_database.py` to push all 6 Modules (45 hours) and Topics from `CONTENT.md` to hosted PostgreSQL.
  - Verification: Database query confirms 6 modules and all topics populated with zero local JSON files.
- [x] **Task 2.2: Dual-Panel Topic Template Component**
  - Build responsive Next.js layout (`grid-cols-12` desktop, stacked mobile) (`frontend/src/components/topic/DualPanelViewer.tsx`).
  - Implement left-panel rendering (KaTeX formulas, markdown, learning objectives, worked clinical examples).
  - Build sticky right-panel visual workstation.
  - Verification: Responsive side-by-side on desktop, mobile stacked view.
- [x] **Task 2.3: Dynamic Scroll Synchronization (`IntersectionObserver`)**
  - Wire section headings to update sticky visual workstation state smoothly on scroll.
  - Verification: Scrolling down left conceptual sections dynamically updates right diagram workstation.
- [x] **Task 2.4: Interactive Mermaid & SVG Diagram Viewer**
  - Implement click-to-explain node interaction, hover tooltips, zoom/pan controls, and step-through animations (`frontend/src/components/diagrams/MermaidDiagram.tsx`).
  - Verification: Clicking diagram node highlights equation in left text panel.

---

## Milestone 3: Client-Side Interactive Image Playgrounds & DICOM Explorer
*Estimated Duration: 2 Days*

- [x] **Task 3.1: CT Window Width & Level (WW/WL) Interactive Slider**
  - Canvas-based dynamic range slider with presets: Brain, Bone, Lung, Soft Tissue (`frontend/src/components/playground/WindowLevelPlayground.tsx`).
  - Verification: Real-time windowing updates canvas at 60 FPS; zero network calls.
- [x] **Task 3.2: 2D Spatial Convolution & Histogram Equalizer**
  - Interactive $3 \times 3$ kernel grid (Sobel, Gaussian, Laplacian) with live pixel convolution on sample scan (`frontend/src/components/playground/SpatialConvolutionPlayground.tsx`).
  - Histogram equalization toggle with live CDF curve rendering.
  - Verification: Verified real-time convolution algorithm matching clinical formulations.
- [x] **Task 3.3: 2D Fourier Transform (FFT) & Frequency Masking**
  - Client-side frequency representation and spatial reconstruction.
  - Verification: Canvas displays spatial domain and processed output.
- [x] **Task 3.4: Privacy-First DICOM Metadata Explorer**
  - Anonymized public sample DICOM parser extracting standard tags (`(0010,0010)`, `(0028,0010)`, `(0028,0030)`) (`frontend/src/components/playground/DicomExplorerPlayground.tsx`).
  - Prominent HIPAA / de-identification clinical disclaimer; blocking patient uploads.
  - Verification: Validates DICOM tag tree rendering using public sample head CT and chest radiographs.

---

## Milestone 4: In-Browser Pyodide Sandbox & Assessment Engine (>75% Pass Rule)
*Estimated Duration: 2 Days*

- [x] **Task 4.1: In-Browser Pyodide WebAssembly Sandbox**
  - Interactive Python coding sandbox executing client-side in WebAssembly (`frontend/src/components/sandbox/PyodideSandbox.tsx`).
  - Code editor, test assertions, and execution terminal with zero server compute expense.
  - Verification: Student Python code runs locally in browser; passes within $<500$ms.
- [x] **Task 4.2: Randomized Question Bank & Quiz Runner**
  - Backend API serving randomized quiz questions per module tagged with COs (`backend/app/api/v1/assessments.py`).
  - Enforce server-side grading and secure answer comparison (answers stripped from client payload).
  - Verification: Automated test proves student cannot inspect API response to find correct answers.
- [x] **Task 4.3: Strict >75% Pass Rule & Retake Engine**
  - Enforce module clearance condition: `score_pct > 75.00`.
  - Record Best Score and Latest Attempt separately in PostgreSQL (`attempts` table).
  - Provide targeted remediation advice for scores $\le 75\%$.
  - Verification: Automated tests in `backend/tests/test_assessments.py` verifying $74.9\%$ (Fail), $75.0\%$ (Fail), and $75.1\%$ (Pass).

---

## Milestone 5: Curriculum-Grounded AI Tutor & Faculty Content Studio
*Estimated Duration: 2 Days*

- [x] **Task 5.1: pgvector RAG Embedding Pipeline**
  - Generate MiniLM embeddings for all topic sections and store in Supabase `topic_embeddings`.
  - Backend cosine similarity retrieval pipeline with Upstash Redis query caching (`backend/app/services/rag_service.py`).
  - Verification: Query for "Radon transform" returns CT attenuation section chunks with cosine similarity $> 0.82$.
- [x] **Task 5.2: Grounded AI Tutor Chat Interface**
  - Connect Gemini 1.5 Flash API with strict course system prompt (`backend/app/api/v1/tutor.py`).
  - Fallback failover to Groq Llama 3.3 70B if rate limits near exhaustion.
  - Enforce clinical refusal guardrail and syllabus topic citations.
  - Verification: Automated tests in `backend/tests/test_tutor_and_faculty.py` verifying clinical refusal and academic grounding.
- [x] **Task 5.3: Faculty Visual Asset Approval Workflow**
  - Authoring studio allowing faculty to review draft visuals and approve/reject before student visibility (`backend/app/api/v1/faculty.py`, `frontend/src/app/faculty/page.tsx`).
  - Verification: Automated tests verifying student 403 access control; one-click approval updating asset status and logging audit trail.

---

## Milestone 6: Class Analytics, 200+ Concurrency Load Testing & Hardening
*Estimated Duration: 1.5 Days*

- [ ] **Task 6.1: Student & Faculty Dashboards**
  - Student: Progress ring, Course Outcome attainment, module attempt history.
  - Faculty: Class score distribution, question difficulty indices, grading override interface.
  - Verification: UI test confirming metrics calculate accurately from hosted PostgreSQL.
- [ ] **Task 6.2: 200+ Concurrency Load Test**
  - k6 / Locust script simulating 200 concurrent students reading topics and taking quizzes.
  - Verification: 0 errors; p95 latency $< 400$ms within free-tier Supabase connection pool limits.
- [ ] **Task 6.3: Production Verification, Sentry Monitoring & Documentation Handover**
  - Configure Sentry free-tier error tracking; verify zero unhandled exceptions.
  - Review all documentation, verify Ralph loop pass status, and prepare final handover report.
