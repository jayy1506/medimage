from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.auth import router as auth_router
from app.api.v1.admin import router as admin_router
from app.api.v1.course import router as course_router
from app.api.v1.assessments import router as assessments_router
from app.api.v1.tutor import router as tutor_router
from app.api.v1.faculty import router as faculty_router
from app.api.v1.roster import router as roster_router
from app.api.v1.curriculum import router as curriculum_router
from app.api.v1.missions import router as missions_router

# Initialize Sentry Monitoring (Free Tier)
if settings.SENTRY_DSN:
    import sentry_sdk
    sentry_sdk.init(
        dsn=settings.SENTRY_DSN,
        environment=settings.ENVIRONMENT,
        traces_sample_rate=0.1
    )

import os
import asyncio
import httpx
from contextlib import asynccontextmanager

async def _keep_render_alive():
    """
    Background keep-alive heartbeat for Render free-tier deployments.
    Pings the public external endpoint every 10 minutes (600s) to reset Render's 15-minute inactivity timer.
    """
    await asyncio.sleep(20)  # Wait for initial boot
    url = os.getenv("RENDER_EXTERNAL_URL") or os.getenv("KEEP_ALIVE_URL")
    if not url:
        return

    target = url.rstrip("/")
    if not target.endswith("/health"):
        target = f"{target}/health"

    print(f"[KEEPALIVE] Anti-sleep heartbeat active targeting: {target}")
    while True:
        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                res = await client.get(target)
                print(f"[KEEPALIVE] Keep-alive ping sent to {target} (Status: {res.status_code})")
        except Exception as e:
            print(f"[KEEPALIVE] Keep-alive ping notice: {e}")
        await asyncio.sleep(600)  # Ping every 10 minutes (well within Render's 15m limit)

@asynccontextmanager
async def lifespan(app: FastAPI):
    task = asyncio.create_task(_keep_render_alive())
    yield
    task.cancel()

app = FastAPI(
    title="Medical Text and Image Processing Learning Platform API",
    description="API for AIDS 12605.1 - Faculty of Engineering and Technology, Adani Institute of Higher Education and Research",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_origin_regex=r"^https?://(localhost|127\.0\.0\.1)(:[0-9]+)?$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API v1 Routers
app.include_router(auth_router, prefix="/api/v1")
app.include_router(admin_router, prefix="/api/v1")
app.include_router(course_router, prefix="/api/v1")
app.include_router(assessments_router, prefix="/api/v1")
app.include_router(tutor_router, prefix="/api/v1")
app.include_router(faculty_router, prefix="/api/v1")
app.include_router(roster_router, prefix="/api/v1")
app.include_router(curriculum_router, prefix="/api/v1")
app.include_router(missions_router, prefix="/api/v1")


@app.get("/health", tags=["System"])
@app.get("/api/v1/health", tags=["System"])
async def health_check():
    """System health check endpoint."""
    return {
        "status": "healthy",
        "service": "medical-image-learning-platform-backend",
        "environment": settings.ENVIRONMENT,
        "database_target": "hosted_postgresql",
        "institution": "Adani Institute of Higher Education and Research"
    }


@app.get("/", tags=["System"])
async def root():
    return {
        "message": "Welcome to Medical Text and Image Processing (AIDS 12605.1) API",
        "docs": "/api/docs"
    }
