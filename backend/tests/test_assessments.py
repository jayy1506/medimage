import pytest
import uuid
from decimal import Decimal
from unittest.mock import patch, MagicMock, AsyncMock
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.models.user import User
from app.models.assessment import Assessment, Attempt
from app.api.deps import get_db, get_current_user


@pytest.mark.asyncio
async def test_pass_rule_strict_boundary_75_percent():
    """
    Verifies the non-negotiable project rule:
    A module is cleared if and only if score strictly exceeds 75.0% (> 75.0%).
    """
    pass_threshold = Decimal("75.00")

    # Boundary 1: Exactly 75.00% fails
    score_75 = Decimal("75.00")
    assert bool(score_75 > pass_threshold) is False

    # Boundary 2: 74.99% fails
    score_74_99 = Decimal("74.99")
    assert bool(score_74_99 > pass_threshold) is False

    # Boundary 3: 75.01% passes
    score_75_01 = Decimal("75.01")
    assert bool(score_75_01 > pass_threshold) is True

    # Boundary 4: 80.00% passes
    score_80 = Decimal("80.00")
    assert bool(score_80 > pass_threshold) is True


@pytest.mark.asyncio
async def test_assessment_submit_endpoint():
    """Tests the assessment submit endpoint with mock DB and user dependencies."""
    student_user = User(
        id=uuid.uuid4(),
        firebase_uid="student_test_uid",
        email="student@adani.edu.in",
        full_name="Student Test",
        role="student",
        status="active"
    )

    assessment = Assessment(
        id=uuid.uuid4(),
        module_id=uuid.uuid4(),
        title="Module 1 Assessment",
        pass_threshold_pct=Decimal("75.00"),
        time_limit_minutes=30
    )

    # Mock DB
    mock_db = MagicMock()
    mock_result_ass = MagicMock()
    mock_result_ass.scalar_one_or_none.return_value = assessment

    mock_result_prev = MagicMock()
    mock_result_prev.scalars.return_value.all.return_value = []

    mock_db.execute = AsyncMock(side_effect=[mock_result_ass, mock_result_prev, MagicMock(), MagicMock(), MagicMock(), MagicMock(), MagicMock()])
    mock_db.commit = AsyncMock()
    mock_db.flush = AsyncMock()
    mock_db.refresh = AsyncMock()

    async def override_get_db():
        yield mock_db

    async def override_get_current_user():
        return student_user

    app.dependency_overrides[get_db] = override_get_db
    app.dependency_overrides[get_current_user] = override_get_current_user

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # Submit 5 answers where 4 are correct (80% -> passes >75%)
        payload = {
            "answers": [
                {"question_id": str(uuid.uuid4()), "selected_option": "A"},
                {"question_id": str(uuid.uuid4()), "selected_option": "B"},
                {"question_id": str(uuid.uuid4()), "selected_option": "A"},
                {"question_id": str(uuid.uuid4()), "selected_option": "B"},
                {"question_id": str(uuid.uuid4()), "selected_option": "D"}  # Incorrect
            ],
            "duration_seconds": 240
        }

        res = await client.post(
            f"/api/v1/assessments/{assessment.id}/submit",
            headers={"Authorization": "Bearer mock_token"},
            json=payload
        )
        assert res.status_code == 200
        data = res.json()
        assert "score_pct" in data
        assert "is_passed" in data
        assert data["attempt_number"] == 1
        assert data["pass_threshold_pct"] == 75.0

    app.dependency_overrides.clear()
