# Debugging & Incident Response Runbook

**Project:** Medical Text and Image Processing Learning Platform (AIDS 12605.1)  
**Status:** Approved for Implementation  

---

## 1. Common Failures & Diagnostic Procedures

### 1.1 HTTP 403 Forbidden: "User Account Not Authorized"
- **Symptom:** User successfully logs into Firebase Auth on the frontend, but every backend API call returns `403 Forbidden`.
- **Root Cause:** The user exists in Firebase Authentication, but their `firebase_uid` is absent from the hosted PostgreSQL `users` table or their `status` is set to `disabled`.
- **Reproduce:**
  ```bash
  curl -H "Authorization: Bearer <VALID_FIREBASE_JWT>" http://localhost:8000/api/v1/course/modules
  ```
- **Resolution:**
  1. Verify user status in Postgres:
     ```sql
     SELECT id, email, role, status FROM users WHERE email = 'student@dmiher.edu.in';
     ```
  2. If missing, re-run invite reconciliation script:
     ```bash
     python scripts/reconcile_users.py --email student@dmiher.edu.in
     ```
  3. If `status = 'disabled'`, verify if an admin deactivated the student.

---

### 1.2 Supabase Connection Pool Exhaustion (`too many clients already`)
- **Symptom:** Backend logs report `asyncpg.exceptions.TooManyConnectionsError` or latency spikes above 5,000ms.
- **Root Cause:** Free-tier Supabase allows up to 60 pooler connections. The application improperly connected via direct port `5432` instead of the transaction pooler `6543`, or database sessions were not properly closed in FastAPI dependencies.
- **Resolution:**
  1. Inspect `backend/.env`: Ensure `DATABASE_URL` connects to port `6543` with `?sslmode=require`. Port `5432` must only be used by Alembic migrations.
  2. Verify that `get_db` FastAPI dependency uses async context manager (`async with async_session() as session:`).
  3. Check active connections in Supabase SQL editor:
     ```sql
     SELECT count(*), state FROM pg_stat_activity GROUP BY state;
     ```

---

### 1.3 AI Tutor HTTP 429: "Gemini API Quota Exceeded"
- **Symptom:** Students querying the AI tutor receive: *"Service temporarily unavailable; please try again shortly."*
- **Root Cause:** Gemini 1.5 Flash Free Tier hits the 15 RPM limit during a high-activity lecture.
- **Resolution:**
  1. The system automatically shifts traffic to the **Groq Llama 3.3 70B** fallback endpoint.
  2. Check Upstash Redis cache hit ratio. If cache hit ratio $< 40\%$, inspect whether prompt normalization is stripping whitespace and lowercasing queries before hashing.
  3. Enforce the client-side debounce limiter (5 seconds between tutor queries per student).

---

### 1.4 Pyodide WebAssembly Memory Error (`RangeError: WebAssembly.Memory`)
- **Symptom:** In-browser coding playground crashes or freezes during execution of high-resolution 3D CT volume reconstruction.
- **Root Cause:** The browser's WASM engine exhausted its 2GB memory boundary when attempting to load a raw 512x512x500 CT slice volume.
- **Resolution:**
  1. Ensure educational datasets pre-subsample 3D CT volumes to $128 \times 128 \times 64$ for in-browser Pyodide memory safety.
  2. Terminate and restart the Pyodide Web Worker if memory consumption crosses 800MB.
  3. Advise students on lower-spec mobile devices to execute 2D single-slice operations rather than 3D volumetric raycasting.

---

### 1.5 Dynamic Dual-Panel Scroll Desynchronization
- **Symptom:** As a student scrolls down the explanatory left panel, the right visual workstation fails to update or jumps erratically.
- **Root Cause:** `IntersectionObserver` threshold is too tight or multiple short sections trigger conflicting state dispatches simultaneously.
- **Resolution:**
  1. In `frontend/src/components/topic/DualPanelViewer.tsx`, set `rootMargin: "-20% 0px -60% 0px"` and `threshold: 0`.
  2. Debounce the active section state update by 50ms to prevent rapid jitter during fast scrolling.

---

## 2. Log File Locations & Telemetry

| Service | Log Source | Access Command / URL |
| :--- | :--- | :--- |
| **Backend API Server** | `uvicorn` stdout / structured JSON | Local: console; Hosted: Render/Railway logs dashboard |
| **Platform Audit Trail** | Hosted Supabase `audit_logs` | `SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 50;` |
| **Client Error Tracking** | Sentry Free Tier | `https://sentry.io/organizations/[org]/issues/` |
| **Redis Command Rates** | Upstash Web Console | `https://console.upstash.com/` |
| **Database Slow Queries** | Supabase Query Performance | Supabase Dashboard -> Database -> Query Performance |
