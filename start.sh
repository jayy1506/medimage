#!/bin/sh
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

if [ -f "${SCRIPT_DIR}/start-platform.js" ]; then
    exec node "${SCRIPT_DIR}/start-platform.js"
fi

if [ -f "/app/start-platform.js" ]; then
    exec node "/app/start-platform.js"
fi

# Fallback direct execution
echo "=============================================="
echo " Starting GyaanLab Unified Platform on Render "
echo "=============================================="

# 1. Start FastAPI backend on 0.0.0.0:8000
echo "[1/2] Launching FastAPI backend on 0.0.0.0:8000..."
cd "${SCRIPT_DIR}/backend" || cd /app/backend
export PYTHONPATH="$(pwd):${PYTHONPATH}"
export PYTHONUNBUFFERED=1

python3 -m uvicorn app.main:app --host 0.0.0.0 --port 8000 2>&1 | tee /tmp/fastapi.log &
BACKEND_PID=$!

# Wait for FastAPI /health to be ready before starting Next.js
echo "[1/2] Waiting for FastAPI to become ready on port 8000..."
count=0
READY=0
while [ $count -lt 30 ]; do
    if ! kill -0 $BACKEND_PID 2>/dev/null; then
        echo "❌ [ERROR] FastAPI process terminated unexpectedly! Backtrace:"
        cat /tmp/fastapi.log
        exit 1
    fi
    if curl -s http://127.0.0.1:8000/health > /dev/null 2>&1; then
        echo "✅ [1/2] FastAPI is ready and responding on port 8000!"
        READY=1
        break
    fi
    count=$((count + 1))
    sleep 1
done

if [ $READY -ne 1 ]; then
    echo "❌ [ERROR] FastAPI failed to become ready after 30 seconds! Backtrace:"
    cat /tmp/fastapi.log
    exit 1
fi

# 2. Start Next.js frontend on 0.0.0.0:$PORT
PORT="${PORT:-10000}"
echo "[2/2] Launching Next.js frontend on 0.0.0.0:${PORT}..."
cd "${SCRIPT_DIR}/frontend" || cd /app/frontend
export PORT="${PORT}"
export HOSTNAME="0.0.0.0"

trap "kill -TERM $BACKEND_PID" INT TERM EXIT

if [ -f "server.js" ]; then
    exec node server.js
else
    exec npm run start -- -p "$PORT" -H "0.0.0.0"
fi
