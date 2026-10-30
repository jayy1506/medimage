import uuid
from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.models.course import Module, Topic, TopicSection, Diagram, VisualAsset, UserProgress
from app.services.roster_redis_service import roster_redis_service

router = APIRouter(prefix="/course", tags=["Curriculum & Topic Viewer"])


class ProgressUpdateRequest(BaseModel):
    is_completed: bool = True
    time_spent_seconds: int = 0


class UserProgressSyncRequest(BaseModel):
    email: str
    topic_slug: Optional[str] = None
    is_completed: Optional[bool] = None
    module_id: Optional[str] = None
    score_pct: Optional[float] = None


@router.get("/modules")
async def get_modules(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Returns all 6 course modules with metadata and topic counts."""
    query = select(Module).options(selectinload(Module.topics)).order_by(Module.order_index)
    res = await db.execute(query)
    modules = res.scalars().all()

    # Get student progress count
    prog_res = await db.execute(select(UserProgress).where(UserProgress.user_id == current_user.id))
    completed_topic_ids = {p.topic_id for p in prog_res.scalars().all() if p.is_completed}

    return [
        {
            "id": str(m.id),
            "module_number": m.module_number,
            "title": m.title,
            "description": m.description,
            "theory_hours": m.theory_hours,
            "co_tags": m.co_tags,
            "order_index": m.order_index,
            "topics_count": len(m.topics),
            "completed_topics_count": sum(1 for t in m.topics if t.id in completed_topic_ids),
            "topics": [
                {
                    "id": str(t.id),
                    "slug": t.slug,
                    "title": t.title,
                    "order_index": t.order_index,
                    "co_tags": t.co_tags,
                    "read_time_minutes": t.read_time_minutes,
                    "is_completed": t.id in completed_topic_ids
                }
                for t in m.topics
            ]
        }
        for m in modules
    ]


@router.get("/modules/{module_id}")
async def get_module_detail(
    module_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Returns module details and full topic outline."""
    query = select(Module).where(Module.id == module_id).options(selectinload(Module.topics))
    res = await db.execute(query)
    module = res.scalar_one_or_none()
    if not module:
        raise HTTPException(status_code=404, detail="Module not found.")

    return {
        "id": str(module.id),
        "module_number": module.module_number,
        "title": module.title,
        "description": module.description,
        "theory_hours": module.theory_hours,
        "co_tags": module.co_tags,
        "topics": [
            {
                "id": str(t.id),
                "slug": t.slug,
                "title": t.title,
                "order_index": t.order_index,
                "co_tags": t.co_tags,
                "read_time_minutes": t.read_time_minutes
            }
            for t in module.topics
        ]
    }


@router.get("/topics/{slug}")
async def get_topic_by_slug(
    slug: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Returns complete topic data for the synchronized dual-panel viewer,
    including sections, linked diagrams, and approved visual assets.
    """
    query = (
        select(Topic)
        .where(Topic.slug == slug)
        .options(
            selectinload(Topic.module),
            selectinload(Topic.sections),
            selectinload(Topic.diagrams),
            selectinload(Topic.visual_assets)
        )
    )
    res = await db.execute(query)
    topic = res.scalar_one_or_none()
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found.")

    # Fetch user completion status
    prog_res = await db.execute(
        select(UserProgress).where(
            UserProgress.user_id == current_user.id,
            UserProgress.topic_id == topic.id
        )
    )
    progress = prog_res.scalar_one_or_none()

    # Filter visual assets: students see only approved assets; faculty/admin see drafts too
    if current_user.role == "student":
        assets = [v for v in topic.visual_assets if v.status == "approved"]
    else:
        assets = topic.visual_assets

    return {
        "id": str(topic.id),
        "slug": topic.slug,
        "title": topic.title,
        "order_index": topic.order_index,
        "co_tags": topic.co_tags,
        "read_time_minutes": topic.read_time_minutes,
        "is_completed": progress.is_completed if progress else False,
        "module": {
            "id": str(topic.module.id),
            "module_number": topic.module.module_number,
            "title": topic.module.title
        },
        "sections": [
            {
                "id": str(s.id),
                "section_number": s.section_number,
                "section_type": s.section_type,
                "title": s.title,
                "content_markdown": s.content_markdown,
                "formula_latex": s.formula_latex,
                "linked_diagram_id": str(s.linked_diagram_id) if s.linked_diagram_id else None,
                "order_index": s.order_index
            }
            for s in topic.sections
        ],
        "diagrams": [
            {
                "id": str(d.id),
                "title": d.title,
                "diagram_type": d.diagram_type,
                "code_or_markup": d.code_or_markup,
                "layer_config": d.layer_config,
                "interactive_node_map": d.interactive_node_map
            }
            for d in topic.diagrams
        ],
        "visual_assets": [
            {
                "id": str(a.id),
                "title": a.title,
                "asset_type": a.asset_type,
                "storage_url": a.storage_url,
                "alt_text": a.alt_text,
                "license": a.license,
                "attribution": a.attribution,
                "status": a.status
            }
            for a in assets
        ]
    }


@router.post("/topics/{topic_id}/progress")
async def update_topic_progress(
    topic_id: uuid.UUID,
    payload: ProgressUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Records topic completion and study duration."""
    res = await db.execute(
        select(UserProgress).where(
            UserProgress.user_id == current_user.id,
            UserProgress.topic_id == topic_id
        )
    )
    prog = res.scalar_one_or_none()

    if prog:
        prog.is_completed = payload.is_completed
        prog.time_spent_seconds += payload.time_spent_seconds
    else:
        prog = UserProgress(
            user_id=current_user.id,
            topic_id=topic_id,
            is_completed=payload.is_completed,
            time_spent_seconds=payload.time_spent_seconds
        )
        db.add(prog)

    await db.commit()
    return {"status": "success", "is_completed": prog.is_completed}


@router.get("/user-progress")
async def get_dynamic_user_progress(email: str):
    """
    Returns user's real progress stored in Upstash Redis.
    Brand new users always start at 0% (zero completed topics).
    """
    if not email:
        raise HTTPException(status_code=400, detail="User email is required.")
    data = await roster_redis_service.get_user_progress(email)
    return data


@router.post("/user-progress")
async def update_dynamic_user_progress(payload: UserProgressSyncRequest):
    """
    Updates completion of a topic or assessment score for a specific user.
    """
    if not payload.email:
        raise HTTPException(status_code=400, detail="User email is required.")
    updated = await roster_redis_service.update_user_progress(
        email=payload.email,
        topic_slug=payload.topic_slug,
        is_completed=payload.is_completed,
        module_id=payload.module_id,
        score_pct=payload.score_pct
    )
    return updated


@router.post("/user-progress/reset")
async def reset_dynamic_user_progress(payload: UserProgressSyncRequest):
    """
    Resets progress to 0% for the given user.
    """
    if not payload.email:
        raise HTTPException(status_code=400, detail="User email is required.")
    reset_data = await roster_redis_service.reset_user_progress(payload.email)
    return reset_data
