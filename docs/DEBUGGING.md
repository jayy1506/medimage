# Debugging & Incident Response Runbook

**Project:** Medical Text and Image Processing Learning Platform (AIDS 12605.1)  
**Institution:** Faculty of Engineering and Technology, Adani Institute of Higher Education and Research (Deemed to be University)  
**Status:** Approved for Implementation  

---

## 1. Common Failures & Diagnostic Procedures

### 1.1 HTTP 403 Forbidden: "User Account Not Authorized"
- **Symptom:** User successfully logs into Firebase Auth on the frontend, but backend API calls return `403 Forbidden`.
- **Root Cause:** The user exists in Firebase Authentication, but their `firebase_uid` is absent from the hosted PostgreSQL `users` table or Upstash Redis roster, or their status is not set to `active`.
- **Reproduce:**
  ```bash
  curl -H "Authorization: Bearer <VALID_FIREBASE_JWT>" http://localhost:8000/api/v1/course/modules
  ```
- **Resolution:**
  1. Verify user status in Postgres / Redis:
     ```sql
     SELECT id, email, role, status FROM users WHERE email = 'student@adani.edu.in';
     ```
  2. If missing or deactivated, open the Admin Dashboard at `/admin`, check the roster, and ensure the student is enrolled with active status.
  3. Ensure the student's email matches the institutional format (`@adani.edu.in`).

---

### 1.2 Supabase Connection Pool Exhaustion (`too many clients already`)
- **Symptom:** Backend logs report `asyncpg.exceptions.TooManyConnectionsError` or API latency spikes above 5,000ms.
- **Root Cause:** Free-tier Supabase allows up to 60 pooler connections. The application connected via direct port `5432` instead of the transaction pooler `6543`, or database sessions were not properly closed in FastAPI dependencies.
- **Resolution:**
  1. Inspect `backend/.env`: Ensure `DATABASE_URL` connects to port `6543` with `?sslmode=require`. Port `5432` must only be used by Alembic migrations.
  2. Verify that the `get_db` FastAPI dependency uses an async context manager (`async with async_session() as session:`).
  3. Check active connections in Supabase SQL editor:
     ```sql
     SELECT count(*), state FROM pg_stat_activity GROUP BY state;
     ```

---

### 1.3 Lexi AI / Gemini Rate Limits (HTTP 429) & Multi-Key Failover
- **Symptom:** Students querying Lexi receive rate-limit notices or slow responses during peak class activity.
- **Root Cause:** A single Gemini free-tier key hit the 15 RPM or daily request quota.
- **Resolution:**
  1. Verify that `GEMINI_API_KEYS` in `.env.local` / `backend/.env` contains multiple comma-separated keys. The multi-key pool rotates automatically upon encountering `429` or `503`.
  2. Verify that Upstash Redis is caching query responses. If cache hit ratio $< 40\%$, inspect whether prompt normalization is stripping whitespace and lowercasing queries before hashing.
  3. Automatic failover to Groq Llama 3.3 70B activates if the Gemini pool is temporarily exhausted.

---

### 1.4 Upstash Redis Roster Sync & Transient Connectivity
- **Symptom:** Admin dashboard warns of Redis synchronization issues or falls back to in-memory/backup state.
- **Root Cause:** Invalid Upstash token, network timeout, or daily free-tier quota (10,000 commands/day) exceeded.
- **Resolution:**
  1. Verify `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` in `backend/.env` and `frontend/.env.local`.
  2. Test raw Redis connectivity:
     ```bash
     curl -H "Authorization: Bearer <TOKEN>" "<UPSTASH_URL>/get/medimage:roster:users"
     ```
  3. Note that `roster_redis_service.py` maintains an in-memory cache and a local disk backup (`roster_backup.json`) so user access is never interrupted by transient network issues.

---

### 1.5 Render Web Service Inactivity Sleep & Keep-Alive Heartbeat
- **Symptom:** First request to the platform after 15 minutes of inactivity experiences a 30–50 second cold-start delay.
- **Root Cause:** Render's free tier spins down web services after 15 minutes of inactivity.
- **Resolution:**
  1. The backend includes a built-in keep-alive background worker (`_keep_render_alive()` in `backend/app/main.py`).
  2. Ensure the environment variable `RENDER_EXTERNAL_URL` (or `KEEP_ALIVE_URL`) is configured in the Render Dashboard with your service's URL (e.g. `https://gyaanlab-platform.onrender.com`).
  3. The heartbeat pings `/health` every 10 minutes (600s), resetting Render's 15-minute sleep timer.
  4. Optionally set up a free monitor on UptimeRobot to ping `https://your-service.onrender.com/health` every 5 minutes.

---

### 1.6 Pyodide WebAssembly Memory Safety
- **Symptom:** In-browser coding playground crashes or freezes during execution of high-resolution 3D CT volume reconstruction.
- **Root Cause:** The browser's WASM engine exhausted its memory boundary when attempting to process an excessively large raw scan array.
- **Resolution:**
  1. Ensure educational datasets pre-subsample 3D CT volumes to $128 \times 128 \times 64$ for in-browser Pyodide memory safety.
  2. Terminate and restart the Pyodide Web Worker if memory consumption crosses 800MB.
  3. Advise students on lower-spec mobile devices to execute 2D single-slice operations rather than 3D volumetric raycasting.

---

### 1.7 Dynamic Dual-Panel Scroll Desynchronization
- **Symptom:** As a student scrolls down the explanatory left panel, the right visual workstation fails to update or jumps erratically.
- **Root Cause:** `IntersectionObserver` threshold is too tight or multiple short sections trigger conflicting state dispatches simultaneously.
- **Resolution:**
  1. In `frontend/src/components/topic/DualPanelViewer.tsx`, ensure `rootMargin: "-20% 0px -60% 0px"` and `threshold: 0`.
  2. Debounce the active section state update by 50ms to prevent rapid jitter during fast scrolling.

---

### 1.8 Next.js Windows / OneDrive `EINVAL: invalid argument, readlink`
- **Symptom:** Next.js dev server or build crashes with: `Error: EINVAL: invalid argument, readlink '...\frontend\.next\static\webpack\...webpack.hot-update.json'` at `recursiveDelete`.
- **Root Cause:** The workspace is in a cloud-synchronized folder (e.g. OneDrive). OneDrive's sync engine creates filesystem reparse points/locks on temporary Webpack HMR artifacts during development, causing Node.js `fs.promises.readlink` to throw `EINVAL` when Next.js cleans old chunks.
- **Resolution:**
  1. Stop any running Next.js dev processes.
  2. Force-purge the corrupted build directory:
     ```powershell
     Remove-Item -Recurse -Force "frontend/.next"
     ```
  3. Ensure `frontend/next.config.js` disables persistent pack caching in development (`config.cache = false;`).
  4. (Optional) Pause OneDrive sync on the project folder, or exclude the `.next` directory from sync.
  5. Restart the server with `npm run dev`.

---

### 1.9 Laptop CSV Upload & Email Deduplication Checks
- **Symptom:** Admin bulk CSV upload reports skipped records.
- **Root Cause:** The admin uploaded a CSV containing email addresses that already exist in the institutional roster.
- **Resolution:**
  1. This is expected, intended behavior. The system automatically deduplicates emails to prevent overwriting existing student progress or credentials.
  2. Inspect the returned `skipped_emails` list in the response.

---

## 2. Log File Locations & Telemetry

| Service | Log Source | Access Command / URL |
| :--- | :--- | :--- |
| **Backend API Server** | `uvicorn` stdout / structured JSON | Local: console; Hosted: Render logs dashboard |
| **Platform Audit Trail** | Upstash Redis & PostgreSQL `audit_logs` | Admin Dashboard `/admin` (Audit tab) or `SELECT * FROM audit_logs;` |
| **Client Error Tracking** | Sentry Free Tier | `https://sentry.io/organizations/[org]/issues/` |
| **Redis Command Rates** | Upstash Web Console | `https://console.upstash.com/` |
| **Database Slow Queries** | Supabase Query Performance | Supabase Dashboard -> Database -> Query Performance |
