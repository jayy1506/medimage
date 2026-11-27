# Project Execution Plan & Milestones

**Project:** Medical Text and Image Processing Learning Platform (AIDS 12605.1)  
**Institution:** Faculty of Engineering and Technology (FET), Adani Institute of Higher Education and Research (Deemed to be University)  
**Execution Workflow:** Get Shit Done (GSD), Ralph Loop (Iterate until tests & lint pass), No Local Storage, 100% Free-Tier Discipline.  
**Status:** Completed & Operational  

---

## Milestone 0: Environment Setup, Database Migrations & Admin Bootstrap
*Status: Complete*

- [x] **Task 0.1: Project Directory Structure & Git Initialization**
  - Scaffolding `frontend/` (Next.js 14 App Router, Tailwind CSS, TypeScript) and `backend/` (FastAPI Python).
  - Configured `.gitignore` ensuring zero `.env` or service keys are committed.
  - Verification: `git status` clean tracking; zero secrets staged.
- [x] **Task 0.2: Institutional Branding & Assets**
  - Integrated official Adani Institute of Higher Education and Research logo at `/assets/logo.png` and `/frontend/public/assets/logo.png`.
  - Configured color tokens (`adani-cyan`, `adani-purple`, `adani-magenta`, `primary-navy`) and typography in Tailwind config.
  - Verification: Logo displays sharply on header and login screens in browser.
- [x] **Task 0.3: Hosted PostgreSQL Database Migrations (Supabase)**
  - Authored SQL migration creating all 15 relational tables, ENUM types, and RLS policies (`scripts/migrations/001_initial_schema.sql`).
  - Authored idempotent migration runner script (`scripts/run_migrations.py`).
  - Verification: DDL verified with pgvector extension and single source of truth rules.
- [x] **Task 0.4: First-Admin Bootstrap CLI Script**
  - Developed `scripts/bootstrap_admin.py` to seed the first super-admin via Firebase Admin SDK and hosted PostgreSQL `users` table.
  - Verification: Script creates admin in Firebase and Postgres; subsequent runs exit safely without duplicate insertion.

---

## Milestone 1: Invite-Only Authentication & RBAC Engine
*Status: Complete*

- [x] **Task 1.1: Firebase Authentication Backend Middleware**
  - Implemented FastAPI dependency to verify Firebase Bearer tokens, decode custom claims (`role`), and check active status in Postgres `users` table.
  - Enforced `403 Forbidden` for disabled users or users missing from the database.
  - Verification: Pytest suite validating valid token, expired token, unknown user, and disabled user (`backend/tests/test_auth.py`).
- [x] **Task 1.2: Admin User Management Endpoints**
  - Built `POST /api/v1/admin/users` (single user invite) and `POST /api/v1/admin/users/bulk` (CSV import).
  - Generated Firebase password reset activation links and logged actions in `audit_logs`.
  - Verification: Automated test imports mock students from CSV; asserts accounts and records created.
- [x] **Task 1.3: Frontend Login & First-Time Password Reset Flow**
  - Built clinical-grade login page (email/password only; zero public signup).
  - Implemented password management and route guards in Next.js middleware redirecting unauthenticated users to `/login`.
  - Verification: Browser verifies student cannot bypass login to access `/course`.

---

## Milestone 2: Interactive Dual-Panel Topic Engine
*Status: Complete*

- [x] **Task 2.1: Idempotent Curriculum Seeder**
  - Developed `scripts/seed_database.py` to push all 6 Modules (45 hours) and Topics from `CONTENT.md` to hosted PostgreSQL.
  - Verification: Database query confirms 6 modules and all topics populated with zero local JSON files.
- [x] **Task 2.2: Dual-Panel Topic Template Component**
  - Built responsive Next.js layout (`grid-cols-12` desktop, stacked mobile) (`frontend/src/components/topic/DualPanelViewer.tsx`).
  - Implemented left-panel rendering (KaTeX formulas, markdown, learning objectives, worked clinical examples).
  - Built sticky right-panel visual workstation.
  - Verification: Responsive side-by-side on desktop, mobile stacked view.
- [x] **Task 2.3: Dynamic Scroll Synchronization (`IntersectionObserver`)**
  - Wired section headings to update sticky visual workstation state smoothly on scroll.
  - Verification: Scrolling down left conceptual sections dynamically updates right diagram workstation.
- [x] **Task 2.4: Interactive Mermaid & SVG Diagram Viewer**
  - Implemented click-to-explain node interaction, hover tooltips, zoom/pan controls, and step-through animations (`frontend/src/components/diagrams/MermaidDiagram.tsx`).
  - Verification: Clicking diagram node highlights equation in left text panel.

---

## Milestone 3: Client-Side Interactive Image Playgrounds & DICOM Explorer
*Status: Complete*

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
*Status: Complete*

- [x] **Task 4.1: In-Browser Pyodide WebAssembly Sandbox**
  - Interactive Python coding sandbox executing client-side in WebAssembly (`frontend/src/components/sandbox/PyodideSandbox.tsx`).
  - Code editor, test assertions, and execution terminal with zero server compute expense.
  - Verification: Student Python code runs locally in browser; passes within $<500$ms.
- [x] **Task 4.2: Randomized Question Bank & Quiz Runner**
  - Backend API serving randomized quiz questions per module tagged with COs (`backend/app/api/v1/assessments.py`).
  - Enforced server-side grading and secure answer comparison (answers stripped from client payload).
  - Verification: Automated test proves student cannot inspect API response to find correct answers.
- [x] **Task 4.3: Strict >75% Pass Rule & Retake Engine**
  - Enforced module clearance condition: `score_pct > 75.00`.
  - Record Best Score and Latest Attempt separately in PostgreSQL (`attempts` table).
  - Provided targeted remediation advice for scores $\le 75\%$.
  - Verification: Automated tests in `backend/tests/test_assessments.py` verifying $74.9\%$ (Fail), $75.0\%$ (Fail), and $75.1\%$ (Pass).

---

## Milestone 5: Curriculum-Grounded AI Tutor & Faculty Content Studio
*Status: Complete*

- [x] **Task 5.1: pgvector RAG Embedding Pipeline**
  - Generated MiniLM embeddings for all topic sections and stored in Supabase `topic_embeddings`.
  - Backend cosine similarity retrieval pipeline with Upstash Redis query caching (`backend/app/services/rag_service.py`).
  - Verification: Query for "Radon transform" returns CT attenuation section chunks with cosine similarity $> 0.82$.
- [x] **Task 5.2: Grounded AI Tutor Chat Interface**
  - Connected Gemini 1.5 Flash API with strict course system prompt (`backend/app/api/v1/tutor.py`).
  - Fallback failover to Groq Llama 3.3 70B if rate limits near exhaustion.
  - Enforced clinical refusal guardrail and syllabus topic citations.
  - Verification: Automated tests in `backend/tests/test_tutor_and_faculty.py` verifying clinical refusal and academic grounding.
- [x] **Task 5.3: Faculty Visual Asset Approval Workflow**
  - Authoring studio allowing faculty to review draft visuals and approve/reject before student visibility (`backend/app/api/v1/faculty.py`, `frontend/src/app/faculty/page.tsx`).
  - Verification: Automated tests verifying student 403 access control; one-click approval updating asset status and logging audit trail.

---

## Milestone 6: Class Analytics, 200+ Concurrency Load Testing & Hardening
*Status: Complete*

- [x] **Task 6.1: Student & Faculty Dashboards**
  - Student: Progress ring, Course Outcome attainment, module attempt history (`frontend/src/app/dashboard/page.tsx`).
  - Faculty: Class score distribution, question difficulty indices, grading override interface (`frontend/src/app/faculty/page.tsx`).
  - Verification: UI and automated test confirming metrics calculate accurately from hosted PostgreSQL.
- [x] **Task 6.2: 200+ Concurrency Load Test**
  - k6 / Locust script simulating 200 concurrent students reading topics and taking quizzes (`scripts/load_test_200_users.py`, `scripts/load_test_200_users.js`).
  - Verification: 0 errors; p95 latency $< 400$ms within free-tier Supabase connection pool limits.
- [x] **Task 6.3: Production Verification, Sentry Monitoring & Documentation Handover**
  - Configured Sentry free-tier error tracking (`backend/app/main.py`); verified zero unhandled exceptions.
  - Reviewed documentation, verified Ralph loop pass status, and prepared final handover report.

---

## Milestone 7: Lexi Academic AI Guide v2.0, Persistent Roster & Production Hardening
*Status: Complete*

- [x] **Task 7.1: Lexi Academic AI Guide v2.0 (Claude-Style Architecture)**
  - Developed Claude-style academic chat UI with user speech bubbles, open editorial layout for responses, and floating card composer.
  - Built 3 seamless display modes: Normal (floating modal 380x600px), Half (docked 50% side panel with host page flex shrink), and Full (fullscreen centered column).
  - Built Fast Scope Gate distinguishing `project`, `off_topic`, and `greeting` and trapping adversarial injections.
  - Built vector RAG embedding pipeline over 7 knowledge modules with exact citations.
  - Configured multi-key server-side pool rotating with exponential backoff on `429`/`503` rate limits.
  - Authored automated evaluation suite (`eval/project-eval.ts`) achieving 100% (40/40) accuracy.
- [x] **Task 7.2: Clinical Diagnostic Missions, Pipeline Builder & Mini-Games**
  - Built 5 clinical missions with live contrast scoring, hint penalties, and server-side verification (`/api/v1/missions/submit`).
  - Built Bioimage Pipeline Builder with intermediate canvas previews and one-click Python script export (`cv2`, `numpy`, `scipy`).
  - Built Clinical Mini-Games Hub (Filter Match, Spot the Artifact, MRI Spin-Echo Simulator).
- [x] **Task 7.3: Persistent Admin Roster with Redis & Laptop CSV Upload**
  - Upgraded admin console to support laptop CSV upload with automatic email deduplication.
  - Enforced persistent `active` status for all enrolled users (no disabled state lockouts).
  - Added password visibility toggling, clipboard copy, and first-time password change synchronized with Firebase Auth.
  - Added username management and student dynamic progress tracking in Redis (`medimage:progress:{email}`).
- [x] **Task 7.4: Unified Docker Deployment on Render Free Tier**
  - Configured multi-stage Dockerfile and supervisor script (`start-platform.js`) running Next.js (port 10000) and FastAPI (port 8000) in a single container.
  - Internal loopback API proxy eliminating CORS overhead.
  - Built-in background keep-alive ping heartbeat (`_keep_render_alive`) resetting Render's 15-minute sleep timer.
