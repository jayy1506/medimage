# =========================================================================
# Unified Dockerfile for GyaanLab Medical Learning Platform (Render Free Tier)
# Runs both Next.js Frontend and FastAPI Backend within a single Web Service
# =========================================================================

# Stage 1: Build Next.js standalone application
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
RUN npm run build

# Stage 2: Unified Python 3.11 + Node.js 20 Runner
FROM python:3.11-slim

# Install system dependencies & Node.js runtime
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    ca-certificates \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y --no-install-recommends nodejs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# 1. Install Backend Python requirements
COPY backend/requirements.txt ./backend/
RUN pip install --no-cache-dir -r ./backend/requirements.txt

COPY backend/ ./backend/

# 2. Copy compiled standalone Next.js frontend
COPY --from=frontend-builder /app/frontend/.next/standalone ./frontend/
COPY --from=frontend-builder /app/frontend/.next/static ./frontend/.next/static
COPY --from=frontend-builder /app/frontend/public ./frontend/public

# 3. Copy startup script
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

ENV PORT=10000
ENV NODE_ENV=production
ENV PYTHONUNBUFFERED=1

EXPOSE 10000

CMD ["/app/start.sh"]
