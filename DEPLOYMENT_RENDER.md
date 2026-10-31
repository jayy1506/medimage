# Deploying GyaanLab on Render (Unified Frontend + Backend)

This project is configured to run **both the Next.js Frontend and the FastAPI Backend together inside a single Web Service on Render's 100% Free Tier**.

You do **not** need Vercel or separate hosting.

---

## Architecture Overview

```
[ Incoming User Traffic (HTTPS) ]
                │
                ▼
    Render Cloud Web Service (Port 10000)
┌───────────────────────────────────────────────┐
│ Next.js Standalone Server (Port 10000)        │
│   ├── Serves React UI, SSR, & Static Assets   │
│   └── Proxies /api/v1/* to localhost:8000 ──┐ │
│                                             │ │
│ FastAPI Python Server (127.0.0.1:8000) ◄────┘ │
│   └── Identity, Redis Roster, Gemini AI, RAG  │
└───────────────────────────────────────────────┘
```

- **Single Web Service:** Fits completely inside Render's free tier (no credit card required).
- **Zero CORS Issues:** Frontend and Backend share the same domain and port.
- **Fast:** Next.js proxies API requests internally over loopback `127.0.0.1:8000`.

---

## 🚀 3-Step Deployment Instructions

### Step 1: Push Code to GitHub
Ensure the latest code is on your repository `jayy1506/medimage` on branch `main`.

### Step 2: Create Web Service on Render
1. Go to **[dashboard.render.com](https://dashboard.render.com/)** and sign in.
2. Click **New +** $\rightarrow$ **Web Service**.
3. Select **Build and deploy from a Git repository** $\rightarrow$ click **Next**.
4. Connect and select your repository: `jayy1506/medimage`.
5. Configure the service:
   - **Name:** `gyaanlab-platform` (or any name you choose)
   - **Region:** Any (e.g. `Oregon (US West)` or `Singapore`)
   - **Branch:** `main`
   - **Runtime:** Select **Docker** (Render will automatically detect the root `Dockerfile`)
   - **Instance Type:** Select **Free** (0.5 CPU, 512 MB RAM)

### Step 3: Add Environment Variables in Render
In the **Environment Variables** section of the Render service creation form, add:

| Key | Example / Value | Description |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | `/api/v1` | High-speed same-origin API proxy |
| `FIREBASE_PROJECT_ID` | `medimage-ca668` | Your Firebase Project ID |
| `FIREBASE_API_KEY` | `AIzaSy...` | Firebase Web API Key |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | `AIzaSy...` | Client Firebase API Key |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID`| `medimage-ca668` | Client Firebase Project ID |
| `UPSTASH_REDIS_REST_URL` | `https://stunning-dinosaur-189382.upstash.io` | Upstash Redis Endpoint |
| `UPSTASH_REDIS_REST_TOKEN` | `gQAAAA...` | Upstash Redis Token |
| `NEXT_PUBLIC_UPSTASH_REDIS_REST_URL` | `https://stunning-dinosaur-189382.upstash.io` | Client Upstash URL |
| `NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN` | `gQAAAA...` | Client Upstash Token |
| `GEMINI_API_KEY` | `AQ.Ab8...` | Gemini AI API Key |
| `DATABASE_URL` | *(your hosted Postgres URL)* | Supabase / Neon connection string |

Click **Deploy Web Service**.

---

## ⚡ What Happens Next
1. Render pulls the repo and runs the multi-stage Docker build:
   - Compiles the Next.js standalone application.
   - Installs Python 3.11 requirements.
2. Render starts the container:
   - FastAPI starts on `127.0.0.1:8000`.
   - Next.js starts on `0.0.0.0:$PORT`.
3. Your platform will be live at `https://gyaanlab-platform.onrender.com`!
