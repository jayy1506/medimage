import os
import json
import httpx
from typing import List, Dict, Any, Optional
from datetime import datetime
from fastapi import APIRouter, HTTPException, Query, Body
from pydantic import BaseModel

from app.core.config import settings

router = APIRouter(prefix="/curriculum", tags=["Curriculum & Question Bank"])

UPSTASH_URL = settings.UPSTASH_REDIS_REST_URL or "https://stunning-dinosaur-189382.upstash.io"
UPSTASH_TOKEN = settings.UPSTASH_REDIS_REST_TOKEN or "gQAAAAAAAuPGAAIgcDFhZjZjZTA1ZGFlMmU0MTk1ODFjMDAzNTg4NGYxYjY0MA"


async def redis_get(key: str) -> Optional[Any]:
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            res = await client.get(
                f"{UPSTASH_URL}/get/{key}",
                headers={"Authorization": f"Bearer {UPSTASH_TOKEN}"}
            )
            if res.status_code == 200:
                val = res.json().get("result")
                return json.loads(val) if val else None
    except Exception as e:
        print(f"[CURRICULUM REDIS] Error reading {key}: {e}")
    return None


async def redis_set(key: str, data: Any) -> bool:
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            res = await client.post(
                f"{UPSTASH_URL}/set/{key}",
                headers={"Authorization": f"Bearer {UPSTASH_TOKEN}"},
                content=json.dumps(data)
            )
            return res.status_code == 200
    except Exception as e:
        print(f"[CURRICULUM REDIS] Error writing {key}: {e}")
    return False


async def record_audit_log(actor: str, action: str, details: str):
    entry = {
        "id": f"aud-{int(datetime.utcnow().timestamp()*1000)}",
        "action": action,
        "actor": actor,
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "details": details
    }
    audits = await redis_get("medimage:curriculum:audit_logs") or []
    audits.insert(0, entry)
    await redis_set("medimage:curriculum:audit_logs", audits[:100])


@router.get("/sources")
async def get_sources():
    sources = await redis_get("medimage:curriculum:sources") or []
    return {"sources": sources}


@router.get("/course-outcomes")
async def get_course_outcomes():
    outcomes = await redis_get("medimage:curriculum:course_outcomes") or []
    return {"course_outcomes": outcomes}


@router.get("/decisions")
async def get_decisions():
    decisions = await redis_get("medimage:curriculum:decisions") or []
    return {"decisions": decisions}


class ResolveDecisionRequest(BaseModel):
    decision_number: int
    actor_email: str = "faculty@adani.edu.in"
    resolution_note: str


@router.post("/decisions/resolve")
async def resolve_decision(payload: ResolveDecisionRequest):
    decisions = await redis_get("medimage:curriculum:decisions") or []
    found = False
    for d in decisions:
        if d.get("decision_number") == payload.decision_number:
            d["status"] = "resolved"
            d["resolution_note"] = payload.resolution_note
            d["resolved_at"] = datetime.utcnow().isoformat() + "Z"
            d["resolved_by"] = payload.actor_email
            found = True
            break
    if not found:
        raise HTTPException(status_code=404, detail=f"Decision #{payload.decision_number} not found.")

    await redis_set("medimage:curriculum:decisions", decisions)
    await record_audit_log(
        actor=payload.actor_email,
        action="RESOLVE_OPEN_DECISION",
        details=f"Resolved Decision #{payload.decision_number}: {payload.resolution_note}"
    )
    return {"status": "success", "decisions": decisions}


@router.get("/overlap-groups")
async def get_overlap_groups():
    groups = await redis_get("medimage:curriculum:overlap_groups") or []
    return {"overlap_groups": groups}


@router.get("/modules")
async def get_modules_summary():
    """Returns summary of all loaded modules."""
    modules = []
    for mod_num in range(1, 7):
        mod = await redis_get(f"medimage:curriculum:module:{mod_num}")
        if mod:
            topics = await redis_get(f"medimage:curriculum:topics:m{mod_num}") or []
            modules.append({
                **mod,
                "topics": topics
            })
    return {"modules": modules}


@router.get("/modules/{mod_num}")
async def get_module_details(mod_num: int):
    mod = await redis_get(f"medimage:curriculum:module:{mod_num}")
    if not mod:
        raise HTTPException(status_code=404, detail=f"Module {mod_num} has not been loaded into the database yet.")
    topics = await redis_get(f"medimage:curriculum:topics:m{mod_num}") or []
    questions = await redis_get(f"medimage:curriculum:questions:m{mod_num}") or []
    return {
        "module": mod,
        "topics": topics,
        "questions_count": len(questions)
    }


@router.get("/modules/{mod_num}/questions")
async def get_module_questions(
    mod_num: int,
    topic_code: Optional[str] = None,
    qtype: Optional[str] = None,
    marks: Optional[int] = None,
    bloom: Optional[int] = None,
    dist: Optional[str] = None
):
    questions = await redis_get(f"medimage:curriculum:questions:m{mod_num}") or []
    if not questions:
        raise HTTPException(status_code=404, detail=f"Questions for Module {mod_num} not loaded.")

    filtered = questions
    if topic_code:
        filtered = [q for q in filtered if q.get("topic_code") == topic_code]
    if qtype:
        filtered = [q for q in filtered if q.get("type", "").upper() == qtype.upper()]
    if marks:
        filtered = [q for q in filtered if q.get("marks") == marks]
    if bloom:
        filtered = [q for q in filtered if q.get("bloom") == bloom]
    if dist:
        filtered = [q for q in filtered if q.get("distribution_level", "").upper() == dist.upper()]

    return {
        "module_number": mod_num,
        "total_module_questions": len(questions),
        "filtered_count": len(filtered),
        "questions": filtered
    }


class ReassignQuestionRequest(BaseModel):
    module_number: int
    question_id: str
    new_topic_code: str
    actor_email: str = "faculty@adani.edu.in"
    rationale: str = "Curriculum alignment update"


@router.post("/questions/reassign")
async def reassign_question(payload: ReassignQuestionRequest):
    questions = await redis_get(f"medimage:curriculum:questions:m{payload.module_number}") or []
    if not questions:
        raise HTTPException(status_code=404, detail=f"Module {payload.module_number} questions not found.")

    target_q = None
    old_topic = None
    for q in questions:
        if q["id"] == payload.question_id:
            old_topic = q.get("topic_code")
            q["topic_code"] = payload.new_topic_code
            target_q = q
            break

    if not target_q:
        raise HTTPException(status_code=404, detail=f"Question {payload.question_id} not found in Module {payload.module_number}.")

    # Update questions in Redis
    await redis_set(f"medimage:curriculum:questions:m{payload.module_number}", questions)

    # Update topic question counts
    topics = await redis_get(f"medimage:curriculum:topics:m{payload.module_number}") or []
    for t in topics:
        t["question_count"] = sum(1 for q in questions if q.get("topic_code") == t["code"])
    await redis_set(f"medimage:curriculum:topics:m{payload.module_number}", topics)

    # Record Audit Log
    await record_audit_log(
        actor=payload.actor_email,
        action="REASSIGN_QUESTION_TOPIC",
        details=f"Reassigned {payload.question_id} from Topic {old_topic} to Topic {payload.new_topic_code}. Rationale: {payload.rationale}"
    )

    return {
        "status": "success",
        "question_id": payload.question_id,
        "old_topic": old_topic,
        "new_topic": payload.new_topic_code,
        "question": target_q
    }


@router.get("/gaps")
async def get_content_gaps():
    """Returns topics across loaded modules that have status 'needs_source' or coverage 'none'."""
    gaps = []
    for mod_num in range(1, 7):
        topics = await redis_get(f"medimage:curriculum:topics:m{mod_num}") or []
        for t in topics:
            if t.get("coverage") == "none" or t.get("status") == "needs_source":
                gaps.append(t)
    return {"gaps_count": len(gaps), "gaps": gaps}


@router.get("/audit-logs")
async def get_audit_logs():
    audits = await redis_get("medimage:curriculum:audit_logs") or []
    return {"audit_logs": audits}
