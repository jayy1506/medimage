#!/bin/sh
set -e

echo "=============================================="
echo " Starting GyaanLab Unified Platform on Render "
echo "=============================================="

# 1. Start FastAPI backend on 0.0.0.0:8000
echo "[1/2] Launching FastAPI backend on 0.0.0.0:8000..."
cd /app/backend
export PYTHONPATH="/app/backend:${PYTHONPATH}"
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

# Wait for FastAPI /health to be ready before starting Next.js
echo "[1/2] Waiting for FastAPI to become ready on port 8000..."
count=0
while [ $count -lt 30 ]; do
    if curl -s http://127.0.0.1:8000/health > /dev/null 2>&1; then
        echo "[1/2] FastAPI is ready and responding on port 8000!"
        break
    fi
    count=$((count + 1))
    sleep 1
done

# 2. Start Next.js frontend on 0.0.0.0:$PORT
PORT="${PORT:-10000}"
echo "[2/2] Launching Next.js frontend on 0.0.0.0:${PORT}..."
cd /app/frontend
export PORT="${PORT}"
export HOSTNAME="0.0.0.0"

# Trap termination signals to gracefully shut down both processes
trap "kill -TERM $BACKEND_PID" INT TERM EXIT

exec node server.js
