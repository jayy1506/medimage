# Setup & Deployment Runbook

**Project:** Medical Text and Image Processing Learning Platform (AIDS 12605.1)  
**Institution:** Faculty of Engineering and Technology, Adani Institute of Higher Education and Research (Deemed to be University)  
**Status:** Approved for Implementation  

---

## 1. Prerequisites & Free Cloud Accounts

Before configuring the project locally or deploying to production, ensure the following free-tier cloud accounts are established:
1. **Firebase Console (Google Cloud):**
   - Create a project (Spark Free Tier).
   - Enable **Authentication** -> **Email/Password**.
   - Under **User actions**, set *Enable email/password sign-up* to **OFF** (enforces invite-only access).
   - Generate a private key: *Project Settings -> Service accounts -> Generate new private key*.
2. **Supabase Cloud:**
   - Create a free hosted PostgreSQL project.
   - Under *SQL Editor*, enable the vector extension: `CREATE EXTENSION IF NOT EXISTS vector;`.
   - Copy the connection strings: **Transaction Pooler (port 6543)** and **Direct Connection (port 5432)**.
3. **Upstash Redis:**
   - Create a free serverless Redis database (10,000 commands/day free tier).
   - Copy the `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`.
4. **Google AI Studio:**
   - Generate free Gemini API Keys for Gemini 1.5 Flash (support multi-key pool via comma-separated keys).
5. **Groq Cloud (Fallback LLM):**
   - Generate a free Groq API Key for Llama 3.3 70B.

---

## 2. Environment Configuration

### 2.1 Backend Environment (`backend/.env`)
Create `backend/.env` (never commit to git):

```env
# Application Settings
ENVIRONMENT=development
PORT=8000
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000,https://gyaanlab-platform.onrender.com

# Hosted Supabase PostgreSQL (Port 6543 for pooling, sslmode=require)
DATABASE_URL=postgresql+asyncpg://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?ssl=require
DIRECT_DATABASE_URL=postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres?sslmode=require

# Firebase Authentication Credentials
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_API_KEY=your-firebase-web-api-key

# Upstash Redis (Persistent Roster, Dynamic Progress & Semantic Cache)
UPSTASH_REDIS_REST_URL=https://[YOUR-ENDPOINT].upstash.io
UPSTASH_REDIS_REST_TOKEN=your_token

# AI LLM Keys (Free Tier)
GEMINI_API_KEY=your_gemini_api_key
GROQ_API_KEY=your_groq_api_key

# Super-Admin Initial Bootstrap
INITIAL_ADMIN_EMAIL=admin@adani.edu.in
INITIAL_ADMIN_PASSWORD=InitialAdminSecurePassword123!
INITIAL_ADMIN_NAME="FET System Administrator"

# Sentry Free Tier DSN (Optional)
SENTRY_DSN=https://...
```

### 2.2 Frontend Environment (`frontend/.env.local`)
Create `frontend/.env.local` (never commit to git):

```env
# Backend API Base URL
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1

# Firebase Client Configuration (Safe for client exposure)
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-web-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-firebase-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef

# Upstash Redis Client Configuration
NEXT_PUBLIC_UPSTASH_REDIS_REST_URL=https://[YOUR-ENDPOINT].upstash.io
NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN=your_token

# Lexi Academic AI Guide Multi-Key Pool (Server-Side Isolation)
GEMINI_API_KEYS=key1,key2,key3
```

---

## 3. Local Development Execution

The platform includes a unified orchestrator script (`dev.js`) that boots both services with health check verification:

```bash
# Install root dependencies
npm install

# Start both FastAPI backend and Next.js frontend in parallel
npm run dev
```

This single command:
1. Launches FastAPI on `http://127.0.0.1:8000`.
2. Verifies backend readiness via `GET /health`.
3. Launches Next.js on `http://localhost:3000`.

### Manual Service Execution (Alternative)

**Backend:**
```bash
cd backend
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
python ../scripts/run_migrations.py
python ../scripts/bootstrap_admin.py
python ../scripts/seed_database.py
uvicorn app.main:app --reload --port 8000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:3000` to access the platform.

---

## 4. Production Deployment on Render (Unified Single Service)

The platform is designed to deploy **both Frontend and Backend inside a single Web Service on Render's 100% Free Tier** using Docker:
- Fits completely inside Render's free tier (no credit card required).
- Next.js runs on port 10000; proxies `/api/v1/*` internally to FastAPI on `127.0.0.1:8000`.
- Zero CORS issues and minimal loopback latency.
- Anti-sleep background heartbeat pings `/health` every 10 minutes to reset Render's 15-minute inactivity timer.

See [DEPLOYMENT_RENDER.md](DEPLOYMENT_RENDER.md) for full deployment instructions.

---

## 5. Verification & Health Checks

1. **Backend Health Check:**
   ```bash
   curl http://localhost:8000/health
   # Expected response: {"status":"healthy","service":"medical-image-learning-platform-backend","institution":"Adani Institute of Higher Education and Research"}
   ```
2. **Frontend Health Check:**
   ```bash
   curl http://localhost:3000/api/health
   # Expected response: {"ok":true}
   ```
3. **Verify Invite-Only Lockdown:**
   - Navigate to `http://localhost:3000`.
   - Confirm only the Login screen is accessible.
   - Confirm there is NO public "Sign Up" option.
