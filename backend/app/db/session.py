from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base
from app.core.config import settings

from urllib.parse import urlparse, parse_qs, urlencode, urlunparse

Base = declarative_base()


def get_async_database_url_and_args(raw_url: str):
    """
    Normalizes database URL for asyncpg:
    - Replaces postgres:// or postgresql:// with postgresql+asyncpg://
    - Removes ?sslmode=... parameter which causes asyncpg TypeError and configures connect_args['ssl'] instead.
    """
    if not raw_url:
        return "postgresql+asyncpg://postgres:postgres@localhost:5432/postgres", {}

    url = raw_url.strip()
    if url.startswith("postgres://"):
        url = "postgresql+asyncpg://" + url[len("postgres://"):]
    elif url.startswith("postgresql://") and not url.startswith("postgresql+asyncpg://"):
        url = "postgresql+asyncpg://" + url[len("postgresql://"):]

    connect_args = {}
    if "sslmode=" in url:
        parsed = urlparse(url)
        query = parse_qs(parsed.query)
        sslmode_val = query.pop("sslmode", [""])[0]
        new_query = urlencode(query, doseq=True)
        url = urlunparse((parsed.scheme, parsed.netloc, parsed.path, parsed.params, new_query, parsed.fragment))
        if sslmode_val in ("require", "verify-ca", "verify-full", "prefer"):
            connect_args["ssl"] = True
    elif "supabase" in url or "neon.tech" in url or "render.com" in url or "pooler" in url:
        connect_args["ssl"] = True

    return url, connect_args


_normalized_db_url, _db_connect_args = get_async_database_url_and_args(settings.DATABASE_URL)

# Use asynchronous engine with connection pooler
engine = create_async_engine(
    _normalized_db_url,
    connect_args=_db_connect_args,
    echo=(settings.ENVIRONMENT == "development"),
    pool_size=10,
    max_overflow=20,
    pool_pre_ping=True
)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False
)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """FastAPI dependency yielding an async database session."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()
