# AGENTS.md: Project rules (Medical Text and Image Processing learning platform)

Persistent rules for every agent task in this workspace. Keep this file under 12,000 characters.

## WORKFLOW (applies to every task)
- **Get Shit Done (GSD):** plan → build → verify → commit, one feature at a time. No gold-plating.
- **Ralph loop:** for each task, loop (implement → run tests → read errors → fix) until tests and lint pass. If stuck after 5 iterations, stop and report.
- **ponytail:** installed as a plugin in this IDE. Use it for task tracking and context at the start of each phase and after each completed task. If you can't find or access it, tell me instead of guessing.
- **Antigravity usage:** use Planning mode for each phase and show the plan before large changes. Use the browser agent to test the running UI (login flow, topic pages, diagrams, quizzes) and attach screenshots as proof. Use MCP servers (Firebase, GitHub, Postgres/Supabase) from the MCP panel. Never commit MCP config files containing secrets.

## ACCESS CONTROL AND AUTH (hard rule)
- **Invite-only platform.** Only an admin can add students and faculty. No one else can use it. There is no public signup page and no self-registration.
- **Login/signup via Firebase Auth:**
  - Public "Sign up" UI does not exist. The login page offers email/password sign-in and "forgot password" only.
  - Disable self-signup in the Firebase project. Admin creates users with the Firebase Admin SDK from the backend (never from the client), then sends the user a password-setup/reset link. Force a password change on first login.
  - Store each user's role (student, faculty, admin) as a Firebase custom claim and mirror it in the Postgres `users` table (firebase_uid, email, role, status).
  - The backend verifies the Firebase ID token on every request, checks the user exists in the Postgres `users` table with status = active, and enforces role-based permissions server-side. A valid Firebase account that is not in the table, or is disabled, gets 403.
  - Protect every frontend route and every API endpoint. Unauthenticated users see only the login page.
  - Bootstrap the first admin with a one-time seed script (email from `.env`), then lock it down.
  - Rate limit login attempts, log admin actions (who added/removed whom, when) in an audit table, and add tests proving that students cannot reach faculty/admin endpoints and that unauthenticated or unlisted users are blocked.
  - Never put the Firebase service account key in the repo or client. Use a backend env var/secret.

## FREE-ONLY CONSTRAINT (hard rule)
Every tool, service, and library must be free or have a usable free tier. No paid APIs, no credit card required. Document each choice and its free-tier limits in ARCHITECTURE.md, plus a fallback if a limit is hit. Include a "Free-tier limits and upgrade path" section in PRD.md.

Preferred free stack (change only with reasons):
- **Frontend:** Next.js or React + Vite, Tailwind, shadcn/ui
- **Backend:** FastAPI (Python suits the AI/image parts) or Node/Express
- **Database:** Supabase or Neon (Postgres) free tier
- **Cache/rate limiting:** Upstash Redis free tier
- **Auth:** Firebase Authentication (Spark free plan), email/password only. Do not use phone auth or Firebase Storage (not free). Firebase handles identity only; all app data stays in the hosted Postgres.
- **File storage:** Supabase Storage or Cloudinary free tier
- **AI/LLM:** Gemini API free tier (primary), Groq free tier (fallback)
- **Embeddings/vector search:** sentence-transformers (MiniLM) + pgvector
- **Hosting:** Vercel (frontend), Render or Railway free tier (backend), or Cloudflare Pages/Workers
- **CDN:** Cloudflare free
- **CI/CD:** GitHub Actions + GitHub
- **Error tracking:** Sentry free tier
- **Logs/monitoring:** Better Stack or Grafana Cloud free tier, UptimeRobot for uptime alerts
- **Testing:** pytest, Vitest/Jest, Playwright
- **Coding questions sandbox:** a free option such as Pyodide (runs in the browser) so no paid code-execution service is needed.

Design for free-tier limits: cache AI responses, rate limit per user, batch requests, lazy-load content, and show graceful errors when quotas run out.

## NO LOCAL STORAGE (hard rule)
- Nothing persistent lives locally: no SQLite files, no local JSON/CSV data, no localStorage/sessionStorage for app data, no on-disk vector indexes or uploads folders.
- Use only the hosted free database as the single source of truth. Use pgvector for embeddings and hosted object storage for files.
- Local use is limited to `.env` (gitignored) and temporary build artifacts. Browser storage may hold only the auth session token, handled by the auth library.
- Seed scripts, syllabus content, quizzes, embeddings, and user progress must be pushed to the hosted database. Write idempotent seed/migration scripts.
- Every milestone ends with: migrate → seed → push to DB → verify by querying the hosted DB → update PLAN.md.
- For development, use a separate free "dev" database project, never a local DB.
- Document this in ARCHITECTURE.md and DATABASE.md.

## RULES
- Small commits, conventional messages, feature branches. Never hardcode secrets; provide `.env.example`.
- Update PLAN.md checkboxes and DEBUGGING.md after every task.
- Accessibility basics and mobile responsiveness are required.
- After each phase, summarize what was done, what's next, and any risks.
- Do not start coding until I approve the Phase 1 docs.
