import pytest
import uuid
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.services.rag_service import rag_service, MANDATORY_CLINICAL_REFUSAL, OFF_SYLLABUS_REFUSAL
from app.api.deps import get_current_user
from app.models.user import User


@pytest.fixture(autouse=True)
def clean_overrides():
    app.dependency_overrides.clear()
    yield
    app.dependency_overrides.clear()


@pytest.mark.asyncio
async def test_clinical_guardrail_refusal():
    """
    Verifies that clinical diagnosis queries or personal scan evaluations
    are rejected immediately with the mandatory refusal message.
    """
    diagnostic_query = "My CT scan shows a 3cm nodule in my right lung, do I have cancer?"
    refusal = rag_service.check_guardrails(diagnostic_query)
    assert refusal == MANDATORY_CLINICAL_REFUSAL

    off_topic_query = "What is the current price of Bitcoin cryptocurrency?"
    refusal_off = rag_service.check_guardrails(off_topic_query)
    assert refusal_off == OFF_SYLLABUS_REFUSAL

    academic_query = "Explain linear attenuation coefficient mu and Half-Value Layer in CT physics."
    assert rag_service.check_guardrails(academic_query) is None


@pytest.mark.asyncio
async def test_academic_tutor_response_generation():
    """
    Verifies that academic syllabus queries yield citations and correct physics explanations.
    """
    res = await rag_service.generate_response(
        topic_title="X-ray and CT Physics",
        topic_id=str(uuid.uuid4()),
        section_contexts=["Section: Beer-Lambert Law and Attenuation Coefficient mu."],
        prompt="Explain attenuation coefficient and Half-Value Layer."
    )

    assert "response" in res
    assert len(res["citations"]) > 0
    assert res["citations"][0]["reference_code"] == "AIDS-12605.1"
    assert "HVL" in res["response"] or "attenuation" in res["response"]


@pytest.mark.asyncio
async def test_student_blocked_from_faculty_endpoints():
    """
    Verifies that student accounts cannot access faculty visual approval queue or authoring studio (403).
    """
    mock_student = User(
        id=uuid.uuid4(),
        firebase_uid="student_test_uid",
        email="student@adani.edu.in",
        full_name="Student Test",
        role="student",
        status="active",
        force_password_change=False
    )

    app.dependency_overrides[get_current_user] = lambda: mock_student

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.get("/api/v1/faculty/visuals/queue")
        assert response.status_code == 403
