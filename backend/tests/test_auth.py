import pytest
import uuid
from unittest.mock import patch, MagicMock, AsyncMock
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.models.user import User
from app.api.deps import get_db, get_current_user


@pytest.fixture(autouse=True)
def clean_overrides():
    app.dependency_overrides.clear()
    yield
    app.dependency_overrides.clear()


@pytest.mark.asyncio
async def test_missing_auth_header():
    """Unauthenticated request must receive 422 or 401."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        res = await client.post("/api/v1/auth/session")
        assert res.status_code in [401, 422]


@pytest.mark.asyncio
async def test_invalid_bearer_format():
    """Bad header without 'Bearer ' prefix must receive 401."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        res = await client.post(
            "/api/v1/auth/session",
            headers={"Authorization": "Basic someCredentials"}
        )
        assert res.status_code == 401
        assert "Bearer" in res.json()["detail"]


@pytest.mark.asyncio
async def test_unregistered_firebase_user_gets_403():
    """
    Proves hard security rule:
    Valid Firebase account not in Postgres `users` table receives 403 Forbidden.
    """
    mock_decoded = {"uid": "rogue_uid_123", "email": "rogue@example.com"}

    mock_db = MagicMock()
    mock_result = MagicMock()
    mock_result.scalar_one_or_none.return_value = None
    mock_db.execute = AsyncMock(return_value=mock_result)

    async def override_get_db():
        yield mock_db

    app.dependency_overrides[get_db] = override_get_db

    with patch("app.api.deps.verify_firebase_token", return_value=mock_decoded):
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            res = await client.post(
                "/api/v1/auth/session",
                headers={"Authorization": "Bearer valid_firebase_token"}
            )
            assert res.status_code == 403
            assert "invite-only" in res.json()["detail"].lower()


@pytest.mark.asyncio
async def test_student_blocked_from_admin_route():
    """
    Proves RBAC rule:
    Authenticated student gets 403 when trying to access admin endpoints.
    """
    student_user = User(
        id=uuid.uuid4(),
        firebase_uid="student_uid_456",
        email="student@adani.edu.in",
        full_name="Student Test",
        role="student",
        status="active",
        force_password_change=False
    )

    mock_db = MagicMock()
    mock_result = MagicMock()
    mock_result.scalar_one_or_none.return_value = student_user
    mock_db.execute = AsyncMock(return_value=mock_result)

    async def override_get_db():
        yield mock_db

    app.dependency_overrides[get_db] = override_get_db

    with patch("app.api.deps.verify_firebase_token", return_value={"uid": "student_uid_456"}):
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            res = await client.post(
                "/api/v1/admin/users",
                headers={"Authorization": "Bearer valid_student_token"},
                json={"email": "new@adani.edu.in", "full_name": "New Student", "role": "student"}
            )
            assert res.status_code == 403
            assert "requires one of ['admin'] roles" in res.json()["detail"]
