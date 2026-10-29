from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.auth import router as auth_router
from app.api.v1.admin import router as admin_router
from app.api.v1.course import router as course_router

app = FastAPI(
    title="Medical Text and Image Processing Learning Platform API",
    description="API for AIDS 12605.1 - Faculty of Engineering and Technology, Adani Institute of Higher Education and Research",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API v1 Routers
app.include_router(auth_router, prefix="/api/v1")
app.include_router(admin_router, prefix="/api/v1")
app.include_router(course_router, prefix="/api/v1")


@app.get("/health", tags=["System"])
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
