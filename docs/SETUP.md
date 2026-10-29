# Setup & Deployment Runbook

**Project:** Medical Text and Image Processing Learning Platform (AIDS 12605.1)  
**Institution:** Faculty of Engineering and Technology (FET), DMIHER  
**Status:** Approved for Implementation  

---

## 1. Prerequisites & Free Cloud Accounts

Before configuring the project locally or deploying, ensure the following free-tier cloud accounts are established:
1. **Firebase Console (Google Cloud):**
   - Create a project (Spark Free Tier).
   - Enable **Authentication** -> **Email/Password**.
   - Under **User actions**, set *Enable email/password sign-up* to **OFF** (enforces invite-only access).
   - Generate a private key: *Project Settings -> Service accounts -> Generate new private key*.
2. **Supabase Cloud:**
   - Create a free project.
   - Under *SQL Editor*, enable the vector extension: `CREATE EXTENSION IF NOT EXISTS vector;`.
   - Under *Storage*, create a public bucket named `visual-assets`.
   - Copy the connection strings: **Transaction Pooler (port 6543)** and **Direct Connection (port 5432)**.
3. **Upstash Redis:**
   - Create a free serverless Redis database (10k requests/day free tier).
   - Copy the `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`.
4. **Google AI Studio:**
   - Generate a free Gemini API Key for Gemini 1.5 Flash.
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
ALLOWED_ORIGINS=http://localhost:3000,https://medical-learning.vercel.app

# Hosted Supabase PostgreSQL (Port 6543 for pooling, sslmode=require)
DATABASE_URL=postgresql+asyncpg://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?ssl=require
DIRECT_DATABASE_URL=postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres?sslmode=require

# Firebase Admin Authentication
# Base64 encoded string of serviceAccountKey.json to prevent file management issues
FIREBASE_SERVICE_ACCOUNT_B64=ewogICJ0eXBlIjogInNlcnZpY2VfYWNjb3VudCIs...
FIREBASE_PROJECT_ID=dmiher-medical-learning

# Upstash Redis (Rate Limiting & Semantic RAG Cache)
UPSTASH_REDIS_REST_URL=https://[PROJECT].upstash.io
UPSTASH_REDIS_REST_TOKEN=AX...

# AI LLM Keys (Free Tier)
GEMINI_API_KEY=AIzaSy...
GROQ_API_KEY=gsk_...

# Super-Admin Initial Bootstrap
INITIAL_ADMIN_EMAIL=admin.fet@dmiher.edu.in
INITIAL_ADMIN_NAME="FET System Administrator"

# Sentry Free Tier DSN
SENTRY_DSN=https://...
```

### 2.2 Frontend Environment (`frontend/.env.local`)
Create `frontend/.env.local` (never commit to git):

```env
# Backend API Base URL
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1

# Firebase Client Configuration (Safe for client exposure)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=dmiher-medical-learning.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=dmiher-medical-learning
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=dmiher-medical-learning.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef

# Supabase Public CDN URL for Visual Assets
NEXT_PUBLIC_SUPABASE_STORAGE_URL=https://[PROJECT_REF].supabase.co/storage/v1/object/public/visual-assets
```

---

## 3. Local Installation & Development

### 3.1 Backend Setup (Python 3.11)
```bash
# Navigate to backend
cd backend

# Create and activate virtual environment
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Unix/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run database migrations against remote Supabase instance
alembic upgrade head

# Bootstrap the initial Super-Admin account
python ../scripts/bootstrap_admin.py

# Push syllabus modules, topics, diagrams, and question banks
python ../scripts/seed_database.py

# Launch FastAPI development server
uvicorn app.main:app --reload --port 8000
```

### 3.2 Frontend Setup (Node.js 18+)
```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start Next.js development server
npm run dev
```

The application will be accessible at `http://localhost:3000`.

---

## 4. Verification & Health Check

1. **Verify Backend Health:**
   ```bash
   curl http://localhost:8000/health
   # Expected response: {"status": "ok", "database": "connected", "redis": "connected"}
   ```
2. **Verify Invite-Only Lockdown:**
   - Navigate to `http://localhost:3000`.
   - Confirm only the Login screen is visible.
   - Confirm there is NO "Sign Up" or "Create Account" option.
3. **Verify Hosted DB Integrity:**
   - Log into Supabase SQL Editor.
   - Run: `SELECT count(*) FROM modules;` -> Should return `6`.
   - Run: `SELECT email, role, status FROM users;` -> Should return the bootstrapped super-admin with role `admin` and status `active`.
