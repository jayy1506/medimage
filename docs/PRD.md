# Product Requirements Document (PRD)

**Project Title:** Medical Text and Image Processing Interactive Learning Platform (MedImage / GyaanLab)  
**Course Code:** AIDS 12605.1 (B.Tech Semester VI)  
**Institution:** Faculty of Engineering and Technology (FET), Adani Institute of Higher Education and Research (Deemed to be University)  
**Version:** 2.0.0 (Production Release)  
**Status:** Approved for Implementation  

---

## 1. Executive Summary & Problem Statement

Modern biomedical engineering and artificial intelligence curricula require students to bridge complex mathematical transformations with real-world clinical imaging modalities (X-ray, CT, MRI, Ultrasound, Nuclear Medicine) and clinical NLP. Traditional learning management systems (LMS) present static slides and text, leaving students struggling to grasp spatial transforms, frequency domain filtering, window/level dynamic range adjustments, and DICOM metadata structures.

This platform is a purpose-built, high-performance, interactive learning ecosystem tailored specifically for **Medical Text and Image Processing (AIDS 12605.1)** at Adani Institute of Higher Education and Research. It features:
- **Synchronized Dual-Panel Topic Engine:** 144 detailed slide units across 6 modules with rich KaTeX equations and sticky right-panel visual workstations connected via `IntersectionObserver`.
- **Client-Side Image Processing Playgrounds:** Real-time (60 FPS) Canvas/WebAssembly workstations for CT Window/Level (WW/WL), 2D Spatial Convolution kernels, 2D Discrete Fourier Transforms (FFT), Otsu & Region Growing segmentation, and a Privacy-First DICOM Tag Explorer.
- **Clinical Missions & Interactive Mini-Games:** Goal-oriented diagnostic challenges with live scoring and server-side verification, visual Bioimage Pipeline Builder with Python script export, and interactive clinical mini-games (Filter Match, Spot the Artifact, MRI Spin-Echo Simulator).
- **In-Browser Pyodide Sandbox:** Zero-cloud-compute Python code execution powered by Pyodide (WebAssembly), pre-loaded with `numpy`, `opencv-python`, and `pydicom`.
- **Lexi Academic AI Guide v2.0:** Claude-style conversational academic guide powered by Google Gemini, featuring a strict scope gate, grounded vector RAG over 7 knowledge modules, a multi-key rotating pool with exponential backoff, and 3 display modes (Normal, Half, Full).
- **Strict Mastery Assessment Engine:** Comprehensive question bank with a mandatory **>75% pass mark** to clear modules, tracking both best and latest attempts.
- **Zero Local Storage & 100% Free Tier:** Zero persistent data stored locally; hosted Supabase PostgreSQL acts as the single source of truth, backed by Upstash Redis for semantic caching and roster persistence.

---

## 2. Stakeholders & User Roles

Access is strictly **invite-only**. No public self-registration exists.

### 2.1 Student
- **Profile:** B.Tech Sem VI Artificial Intelligence & Data Science students enrolled in course AIDS 12605.1.
- **Capabilities:**
  - View course modules and interactive topic pages with synchronized diagrams, equations, and worked clinical case studies.
  - Interact with client-side image processing tools (CT windowing, convolution, Fourier filtering, segmentation, DICOM explorer) without saving local data.
  - Complete goal-based diagnostic missions, build bioimage pipelines, and play clinical mini-games.
  - Query Lexi Academic AI Guide with academic scope guardrails and exact topic citations.
  - Attempt formative module quizzes (MCQ, short answer with AI auto-grading, and Pyodide coding challenges).
  - Track syllabus mastery against Course Outcomes (CO1 to CO4) with mandatory **>75% pass threshold** per module.
  - View attempt history (best vs. latest attempt recorded).

### 2.2 Faculty
- **Profile:** Course instructors and lab assistants for AIDS 12605.1.
- **Capabilities:**
  - Author and edit topic content, diagrams (Mermaid/SVG), and question banks.
  - Utilize AI-assisted content drafting for topic overviews, worked examples, and quick-check questions.
  - Review and approve draft visual assets and AI-generated illustrations before student visibility.
  - Monitor aggregate class analytics, pass rates, question difficulty indices, and student struggle points.
  - Review AI-graded short-answer submissions and manually override scores/feedback.

### 2.3 Administrator
- **Profile:** Department Head or platform system administrator.
- **Capabilities:**
  - Sole authority to invite and provision users via single-user invitation or laptop CSV file upload.
  - Automatic email deduplication, persistent active access, and alphabetical roster sorting.
  - Manage user credentials: view temporary passwords, trigger password reset links, and configure roles (`student`, `faculty`, `admin`).
  - Access persistent roster and immutable audit logs backed by Upstash Redis and PostgreSQL.
  - Execute database migrations, seed scripts, and monitor platform health and free-tier service quota consumption.

---

## 3. Scope & Non-Goals

### 3.1 In-Scope
1. **Interactive Dual-Panel Topic Engine:** Synchronized interface (Left: Concept/Math/Clinical Context; Right: Sticky Mermaid/SVG diagrams and interactive visual workstations).
2. **Client-Side Image Processing Workstations:** Fast in-browser execution (WW/WL, histograms, FFT, convolution kernels, Otsu/region growing) and privacy-guaranteed DICOM viewer using anonymized public sample scans.
3. **Clinical Diagnostic Missions & Mini-Games:** Goal-based scoring missions with server verification, sequential pipeline builder with Python script export, and interactive clinical games.
4. **In-Browser Coding Sandbox:** Client-side Python execution via Pyodide with `numpy`, `opencv`, and `pydicom` for coding assessments.
5. **Strict Invite-Only Authentication:** Firebase Auth with custom claims validated server-side against hosted PostgreSQL and Upstash Redis.
6. **Assessment & Grading Engine:** MCQ pools, coding tests, and module retakes tracking best and latest attempts with a strict **>75% pass rule**.
7. **Lexi Academic AI Guide v2.0:** Claude-style chat interface, fast scope gate, vector RAG retrieval, multi-key pool resilience, and 3 display modes (Normal, Half, Full).
8. **Free-Tier Resilience:** Architecture engineered to operate entirely on generous free-tier cloud services (Render, Supabase, Firebase, Upstash Redis, Google AI Studio) with graceful degradation when quotas near exhaustion.

### 3.2 Non-Goals (Out of Scope)
- **No Diagnostic or Clinical Use:** This platform is strictly an educational tool. It does not provide clinical diagnoses, medical advice, or real patient record processing.
- **No Local Storage:** No SQLite databases, local CSV/JSON persistence, or un-hosted local file storage.
- **No Self-Registration:** Public sign-up routes, social logins, and open user registration are explicitly prohibited.
- **No Paid APIs / Services:** Zero dependencies requiring credit cards or paid subscription tiers.

---

## 4. Course Outcomes (CO) Alignment

The curriculum fulfills 4 Core Course Outcomes for AIDS 12605.1:
- **CO1:** Describe various modalities of medical image sources (Radiology, CT, MRI, Ultrasound, Nuclear Medicine).
- **CO2:** Explain image processing operations and representation (Voxels, dynamic range, DICOM, SNR).
- **CO3:** Apply image transformation tools to various applications (Filtering, Fourier transforms, segmentation, morphological ops).
- **CO4:** Design tools to read, visualize, and process medical images (Reformatting, rendering, volume visualization, DICOM parsing).

Every topic, quiz question, assignment, and coding exercise is tagged with at least one CO to maintain accreditation compliance.

---

## 5. Pass Rule & Retake Engine

- **Threshold:** A student passes a module assessment if and only if they score **> 75.0%**. Scores $\le 75.0\%$ require remediation.
- **Attempts:** Students are allowed retakes to achieve mastery.
- **Question Randomization:** Quizzes pull random subsets from the module's faculty-approved question bank tagged by difficulty and CO.
- **Progress Tracking:** Both the **Best Score** (used for clearing prerequisite modules and leaderboard standing) and **Latest Attempt** (timestamp, duration, answers) are recorded in the database.
- **Remediation Feedback:** Upon scoring $\le 75\%$, students receive a targeted breakdown highlighting specific topic sections and diagrams needing review.

---

## 6. Free-Tier Limits and Upgrade Path

Every service selected for this platform possesses a robust, credit-card-free tier. The system employs defensive design patterns (caching, batching, client-side execution, rate limiting) to sustain 200+ active students within these bounds.

| Component | Selected Free Provider | Free Tier Limits | Mitigation & Fallback Strategy | Upgrade Path (If Funded) |
| :--- | :--- | :--- | :--- | :--- |
| **Database & Vector** | **Supabase** (PostgreSQL + pgvector) | 500 MB database, 50,000 monthly active users, 2 projects | Compact schema, normalized text, indexed pgvector embeddings, connection pooling via Supabase pooler (port 6543). | Supabase Pro ($25/mo) |
| **Object Storage** | **Supabase Storage** | 1 GB storage, 2 GB bandwidth/mo | Compress visual assets to WebP/SVG; cache diagram templates; client-side temporary scans for playgrounds. | Cloudflare R2 / AWS S3 |
| **Cache & Rate Limit** | **Upstash Redis** | 10,000 commands/day free | Cache AI tutor answers by question hash (TTL 7 days); cache roster and session progress; fallback to in-memory FastAPI cache if daily limit approaches 90%. | Upstash Pay-as-you-go ($0.2/100k requests) |
| **Authentication** | **Firebase Auth** | 50,000 monthly active users (Email/Password) | Ample capacity for 200–1,000 students; invite-only model prevents spam. | Firebase Blaze (Pay-as-you-go) |
| **AI LLM / Tutor** | **Google Gemini API** (Free Tier) | 15 RPM, 1,500 RPD (Gemini 1.5 Flash / Flash-Lite) | Multi-key pool rotation with exponential backoff; Upstash Redis semantic caching; secondary fallback to **Groq Free Tier** (Llama 3.3 70B @ 30 RPM). | Google AI Studio Paid Tier |
| **Code Execution** | **Pyodide** (WebAssembly in browser) | Unlimited (runs on client hardware) | Zero server load; pre-caches Pyodide wheels in browser memory; no server sandbox required. | AWS Lambda / Sandboxed MicroVMs |
| **Frontend & Backend Hosting** | **Render** (Unified Docker Web Service) | 750 free instance hours/month | Next.js and FastAPI co-located in a single Docker container on port 10000; internal loopback proxy to port 8000; background keep-alive ping resets Render's 15-minute sleep timer. | Render Standard ($7/mo) |
| **Alternative Frontend Hosting** | **Vercel** / **Cloudflare Pages** | 100 GB bandwidth, unlimited serverless invocations within fair use | Static rendering (SSG/ISR) for topic templates, client-side visual interactions. | Vercel Pro ($20/mo) |
| **Monitoring** | **Sentry** (Developer Free) | 5,000 errors/mo | High sample rates for critical auth/DB paths; low sample rate for client UI logs. | Sentry Team ($26/mo) |

---

## 7. Success Metrics & Key Performance Indicators (KPIs)

1. **Academic Performance:** $\ge 85\%$ of active students clearing module milestones at $>75\%$ threshold within 2 attempts.
2. **Latency & Responsiveness:** Interactive topic diagrams render in $< 150$ms; Pyodide code executes within $< 500$ms client-side; image processing updates at 60 FPS ($< 16$ms).
3. **Reliability & Uptime:** 99.5% uptime during academic instruction windows (8:00 AM – 8:00 PM IST).
4. **Free Tier Adherence:** Zero platform disruptions caused by cloud budget overruns or API tier lockouts.
5. **Security & Privacy:** 0 unauthorized self-registrations; zero patient identifiable data handled or retained.
