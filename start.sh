#!/bin/sh
set -e

echo "=============================================="
echo " Starting GyaanLab Unified Platform on Render "
echo "=============================================="

# 1. Start FastAPI backend on 127.0.0.1:8000
echo "[1/2] Launching FastAPI backend on 127.0.0.1:8000..."
cd /app/backend
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 &
BACKEND_PID=$!

# Wait briefly for backend socket to initialize
sleep 2

# 2. Start Next.js frontend on 0.0.0.0:$PORT
PORT="${PORT:-10000}"
echo "[2/2] Launching Next.js frontend on 0.0.0.0:${PORT}..."
cd /app/frontend
export PORT="${PORT}"
export HOSTNAME="0.0.0.0"

# Trap termination signals to gracefully shut down both processes
trap "kill -TERM $BACKEND_PID" INT TERM EXIT

exec node server.js
