# Product Requirements Document (PRD)

**Project Title:** Medical Text and Image Processing Interactive Learning Platform  
**Course Code:** AIDS 12605.1 (B.Tech Semester VI)  
**Institution:** Faculty of Engineering and Technology (FET), Datta Meghe Institute of Higher Education & Research (DMIHER)  
**Version:** 1.0.0 (Phase 1 Baseline)  
**Status:** Approved for Implementation  

---

## 1. Executive Summary & Problem Statement

Modern biomedical engineering and artificial intelligence curricula require students to bridge complex mathematical transformations with real-world clinical imaging modalities (X-ray, CT, MRI, Ultrasound, Nuclear Medicine) and clinical NLP. Traditional learning management systems (LMS) present static slides and text, leaving students struggling to grasp spatial transforms, frequency domain filtering, window/level dynamic range adjustments, and DICOM metadata structures.

This platform is a purpose-built, high-performance, interactive learning ecosystem tailored specifically for **Medical Text and Image Processing (AIDS 12605.1)** at DMIHER FET. It features side-by-side synchronized visual and conceptual explanations, interactive client-side image processing playgrounds, Pyodide in-browser code execution for medical imaging libraries (`numpy`, `opencv-python`, `pydicom`), and an AI clinical tutor grounded strictly in approved syllabus content.

---

## 2. Stakeholders & User Roles

Access is strictly **invite-only**. No public self-registration exists.

### 2.1 Student
- **Profile:** B.Tech Sem VI Artificial Intelligence & Data Science students enrolled in course AIDS 12605.1.
- **Capabilities:**
  - View course modules, topic pages with synchronized interactive diagrams and demos.
  - Interact with client-side image processing tools (windowing, thresholding, filtering, DICOM explorer) without saving local data.
  - Query the context-aware AI Tutor scoped strictly to current topic concepts and diagrams.
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
  - Sole authority to invite/provision users (single user creation or bulk CSV import).
  - Assign user roles (`student`, `faculty`, `admin`) via Firebase Custom Claims and PostgreSQL mirror.
  - Force password resets and manage user lifecycle (disable/delete accounts).
  - Execute database migrations, seed scripts, and inspect system audit logs.
  - Monitor platform health and free-tier service quota consumption.

---

## 3. Scope & Non-Goals

### 3.1 In-Scope
1. **Interactive Topic-Page Engine:** Dual-panel desktop interface (Left: Concept/Math/Clinical Context; Right: Sticky synchronized Mermaid/SVG diagrams and interactive sliders).
2. **Client-Side Image Playground & DICOM Viewer:** Fast in-browser execution (windowing, histograms, FFT, convolution kernels) and privacy-guaranteed DICOM viewer using anonymized public sample scans.
3. **In-Browser Coding Sandbox:** Client-side Python execution via Pyodide with `numpy`, `opencv`, and `pydicom` for coding assessments.
4. **Strict Invite-Only Authentication:** Firebase Auth with custom claims validated server-side against hosted PostgreSQL.
5. **Assessment & Grading Engine:** MCQ pools, AI-evaluated short answers with rubric constraints, coding tests, and module retakes tracking best and latest attempts (>75% passing rule).
6. **AI Course Tutor:** RAG pipeline restricted exclusively to approved curriculum topics with diagram node referencing.
7. **Free-Tier Resilience:** Architecture engineered to operate entirely on generous free-tier cloud services with graceful degradation when quotas near exhaustion.

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

- **Threshold:** A student passes a module assessment if and only if they score **> 75.0%**.
- **Attempts:** Students are allowed retakes to achieve mastery.
- **Question Randomization:** Quizzes pull random subsets from the module's faculty-approved question bank tagged by difficulty and CO.
- **Progress Tracking:** Both the **Best Score** (used for clearing prerequisite modules and leaderboard standing) and **Latest Attempt** (timestamp, duration, answers) are recorded in the database.
- **Remediation Feedback:** Upon scoring ≤ 75%, students receive a targeted breakdown highlighting specific topic sections and diagrams needing review.

---

## 6. Free-Tier Limits and Upgrade Path

Every service selected for this platform possesses a robust, credit-card-free tier. The system employs defensive design patterns (caching, batching, client-side execution, rate limiting) to sustain 200+ active students within these bounds.

| Component | Selected Free Provider | Free Tier Limits | Mitigation & Fallback Strategy | Upgrade Path (If Funded) |
| :--- | :--- | :--- | :--- | :--- |
| **Database & Vector** | **Supabase** (PostgreSQL + pgvector) | 500 MB database, 50,000 monthly active users, 2 projects | Compact schema, normalized text, indexed pgvector embeddings, connection pooling via Supabase pooler (port 6543). | Supabase Pro ($25/mo) |
| **Object Storage** | **Supabase Storage** | 1 GB storage, 2 GB bandwidth/mo | Compress visual assets to WebP/SVG; cache diagram templates; client-side temporary scans for playgrounds. | Cloudflare R2 / AWS S3 |
| **Cache & Rate Limit** | **Upstash Redis** | 10,000 commands/day free | Cache AI tutor answers by question hash (TTL 7 days); cache topic metadata in browser session; fallback to in-memory FastAPI cache if daily limit approaches 90%. | Upstash Pay-as-you-go ($0.2/100k requests) |
| **Authentication** | **Firebase Auth** | 50,000 monthly active users (Email/Password) | Ample capacity for 200–1,000 students; invite-only model prevents spam. | Firebase Blaze (Pay-as-you-go) |
| **AI LLM / Tutor** | **Google Gemini API** (Free Tier) | 15 RPM, 1,500 RPD (Gemini 1.5 Flash) | Upstash Redis semantic caching; debounce AI tutor chats; secondary fallback to **Groq Free Tier** (Llama 3.3 70B @ 30 RPM). | Google AI Studio Paid Tier |
| **Code Execution** | **Pyodide** (WebAssembly in browser) | Unlimited (runs on client hardware) | Zero server load; pre-caches Pyodide wheels in browser IndexedDB/Service Worker; no server sandbox required. | AWS Lambda / Sandboxed MicroVMs |
| **Frontend Hosting** | **Vercel** / **Cloudflare Pages** | 100 GB bandwidth, unlimited serverless invocations within fair use | Static rendering (SSG/ISR) for topic templates, client-side visual interactions. | Vercel Pro ($20/mo) |
| **Backend Hosting** | **Render** or **Railway** (Free/Hobby) | 750 free instance hours/month | FastAPI keeps lightweight footprint; Pyodide offloads compute; cron ping via UptimeRobot keeps service active during class hours. | Render Standard ($7/mo) |
| **Monitoring** | **Sentry** (Developer Free) | 5,000 errors/mo | High sample rates for critical auth/DB paths; low sample rate for client UI logs. | Sentry Team ($26/mo) |

---

## 7. Success Metrics & Key Performance Indicators (KPIs)

1. **Academic Performance:** ≥ 85% of active students clearing module milestones at >75% threshold within 2 attempts.
2. **Latency & Responsiveness:** Interactive topic diagrams render in < 150ms; Pyodide code executes within < 500ms client-side.
3. **Reliability & Uptime:** 99.5% uptime during academic instruction windows (8:00 AM – 8:00 PM IST).
4. **Free Tier Adherence:** Zero platform disruptions caused by cloud budget overruns or API tier lockouts.
5. **Security & Privacy:** 0 unauthorized self-registrations; zero patient identifiable data handled or retained.
