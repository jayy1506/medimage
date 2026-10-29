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
