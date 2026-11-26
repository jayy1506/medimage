# Operational Troubleshooting Guide

## Frontend & Build Issues

### 404 Errors on `/_next/static/css/...` or `main-app.js`
- **Cause:** When the `.next` build cache is purged while the Next.js dev server (`npm run dev`) is actively running, Webpack in-memory compilation state becomes desynchronized with disk.
- **Fix:** Stop the dev server in the terminal (`Ctrl + C`), restart it (`npm run dev`), and perform a hard browser refresh (`Ctrl + F5` or `Ctrl + Shift + R`).

### Missing Module `./vendor-chunks/next.js`
- **Cause:** Corrupted Webpack cache in cloud-synced directory (e.g., OneDrive).
- **Fix:** Terminate running Node process, delete `frontend/.next`, and restart the dev server.

## Backend & Connectivity Issues

### `ECONNREFUSED 127.0.0.1:8000`
- **Cause:** The FastAPI backend server is not running on port 8000.
- **Fix:** Always start both services together from the root directory using `npm run dev` (which executes `node dev.js`).

### `Could not resolve host: github.com` on Git Push
- **Cause:** Transient Windows DNS cache resolution timeout.
- **Fix:** Run `ipconfig /flushdns` in PowerShell and re-run `git push origin main`.

### Gemini API Rate Limits (429 Quota Exceeded)
- **Cause:** Hitting Google Gemini free-tier rate limits during peak usage.
- **Fix:** Built-in failover. Lexi uses a multi-key pool (`GEMINI_API_KEYS`) that automatically catches 429 errors and rotates to the next available API key with exponential backoff and automated retry.
