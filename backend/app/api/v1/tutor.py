import uuid
from typing import Optional, List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.models.course import Topic, TopicSection
from app.services.rag_service import rag_service

router = APIRouter(prefix="/tutor", tags=["AI Clinical Tutor"])


class TutorChatRequest(BaseModel):
    topic_id: uuid.UUID
    prompt: str
    active_diagram_node: Optional[str] = None


class Citation(BaseModel):
    topic_title: str
    section_number: int
    reference_code: str


class TutorChatResponse(BaseModel):
    response: str
    citations: List[Citation]
    highlight_diagram_node: Optional[str] = None


class TutorGeneralAskRequest(BaseModel):
    prompt: str
    topic_id: Optional[str] = None
    topic_title: Optional[str] = None
    active_diagram_node: Optional[str] = None


class TutorGeneralAskResponse(BaseModel):
    response: str
    is_relevant: bool
    citations: List[Citation] = []
    highlight_diagram_node: Optional[str] = None


@router.post("/ask", response_model=TutorGeneralAskResponse)
async def ask_tutor_general(payload: TutorGeneralAskRequest):
    """
    Direct endpoint for the interactive Claude-style AI Tutor.
    Validates course relevance, enforces clinical safety guardrails,
    and returns rich answers grounded in AIDS 12605.1 syllabus.
    """
    prompt = payload.prompt.strip()
    if not prompt:
        raise HTTPException(status_code=400, detail="Prompt cannot be empty.")

    # Guardrail evaluation
    refusal = rag_service.check_guardrails(prompt)
    if refusal:
        return TutorGeneralAskResponse(
            response=refusal,
            is_relevant=False,
            citations=[],
            highlight_diagram_node=None
        )

    title = payload.topic_title or "Medical Text & Image Processing (AIDS 12605.1)"
    topic_id = payload.topic_id or "general-tutor"

    result = await rag_service.generate_response(
        topic_title=title,
        topic_id=topic_id,
        section_contexts=[
            "Official B.Tech Course Syllabus: AIDS 12605.1 Medical Text and Image Processing.",
            "Covers Module 1 (Physics/Modalities: X-ray, CT, MRI, Ultrasound, PET/SPECT), "
            "Module 2 (Digital Standards: DICOM, IOD, VR, PACS, Metadata, HIPAA De-identification), "
            "Module 3 (Spatial Processing: Convolution, Sobel, Laplacian, High-boost, FFT, Frequency filtering), "
            "Module 4 (Reconstruction & Segmentation: Radon Transform, Sinograms, FBP, Otsu, Active Contours, Level Sets), "
            "Module 5 (Deep Learning: UNet, ResNet, Dice/IoU loss, 3D Convolutions, V-Net), "
            "Module 6 (Clinical NLP & 3D: BioBERT, ClinicalBERT, NER, Marching Cubes, Surface/Volume Rendering)."
        ],
        prompt=prompt,
        active_diagram_node=payload.active_diagram_node
    )

    citations = [
        Citation(
            topic_title=c.get("topic_title", title),
            section_number=c.get("section_number", 1),
            reference_code=c.get("reference_code", "AIDS-12605.1")
        )
        for c in result.get("citations", [])
    ]

    return TutorGeneralAskResponse(
        response=result.get("response", "Could not synthesize response."),
        is_relevant=True,
        citations=citations,
        highlight_diagram_node=result.get("highlight_diagram_node")
    )


@router.post("/chat", response_model=TutorChatResponse)
async def chat_with_tutor(
    payload: TutorChatRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    RAG-grounded AI Tutor assistant.
    Retrieves topic sections from PostgreSQL, checks clinical guardrails,
    and returns syllabus-grounded answer with citations.
    """
    # Fetch topic and sections from database
    t_res = await db.execute(select(Topic).where(Topic.id == payload.topic_id))
    topic = t_res.scalar_one_or_none()
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found.")

    sec_res = await db.execute(select(TopicSection).where(TopicSection.topic_id == payload.topic_id))
    sections = sec_res.scalars().all()
    section_texts = [f"Section: {s.title}\n{s.content_markdown}" for s in sections]

    # Generate grounded response
    result = await rag_service.generate_response(
        topic_title=topic.title,
        topic_id=str(topic.id),
        section_contexts=section_texts,
        prompt=payload.prompt,
        active_diagram_node=payload.active_diagram_node
    )

    return result

