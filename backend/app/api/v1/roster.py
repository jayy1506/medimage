from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any
from app.services.roster_redis_service import roster_redis_service

router = APIRouter(prefix="/admin/roster", tags=["Admin Roster (Redis Persisted)"])


class InviteUserRequest(BaseModel):
    email: EmailStr
    full_name: str
    role: str = "student"
    temporary_password: Optional[str] = "Feat@123"
    actor_email: Optional[str] = "jthakre62@gmail.com"


class UpdateStatusRequest(BaseModel):
    status: str
    actor_email: Optional[str] = "jthakre62@gmail.com"


class ResetPasswordRequest(BaseModel):
    new_password: str = "Feat@123"
    actor_email: Optional[str] = "jthakre62@gmail.com"


class ChangePasswordRequest(BaseModel):
    email: EmailStr
    new_password: str


@router.get("", summary="Get all students, faculty, and admins from Redis cache")
async def get_roster():
    users = await roster_redis_service.get_roster()
    audit_logs = await roster_redis_service.get_audit_logs()
    return {
        "users": users,
        "audit_logs": audit_logs,
        "source": "upstash_redis"
    }


@router.post("", summary="Add new student or faculty with default password Feat@123")
async def add_roster_user(payload: InviteUserRequest):
    new_user = {
        "id": f"u-{int(id(payload))}",
        "email": payload.email,
        "full_name": payload.full_name,
        "role": payload.role,
        "status": "pending_first_login",
        "temporary_password": payload.temporary_password or "Feat@123",
        "force_password_change": True,
        "created_at": "2026-10-30T00:00:00Z"
    }
    updated_roster = await roster_redis_service.add_user(new_user, actor_email=payload.actor_email)
    audit_logs = await roster_redis_service.get_audit_logs()
    return {
        "message": f"Successfully added {payload.role} {payload.email} with default password Feat@123",
        "users": updated_roster,
        "audit_logs": audit_logs
    }


@router.post("/{user_id}/reset-password", summary="Reset user password back to Feat@123")
async def reset_password(user_id: str, payload: ResetPasswordRequest):
    updated = await roster_redis_service.reset_user_password(
        user_id,
        new_password=payload.new_password,
        actor_email=payload.actor_email
    )
    audit_logs = await roster_redis_service.get_audit_logs()
    return {
        "message": f"Password reset to {payload.new_password} for user",
        "users": updated,
        "audit_logs": audit_logs
    }


@router.post("/change-password", summary="Change password on first login")
async def change_password(payload: ChangePasswordRequest):
    success = await roster_redis_service.change_user_password(
        email=payload.email,
        new_password=payload.new_password
    )
    if not success:
        raise HTTPException(status_code=404, detail="User not found in roster")
    return {
        "message": "Password successfully updated. Account activated.",
        "status": "active"
    }


@router.patch("/{user_id}/status", summary="Toggle user status in Redis")
async def toggle_status(user_id: str, payload: UpdateStatusRequest):
    updated = await roster_redis_service.update_user_status(user_id, payload.status, actor_email=payload.actor_email)
    audit_logs = await roster_redis_service.get_audit_logs()
    return {
        "users": updated,
        "audit_logs": audit_logs
    }


@router.delete("/{user_id}", summary="Delete student or faculty from Redis")
async def delete_roster_user(user_id: str, actor_email: Optional[str] = "jthakre62@gmail.com"):
    updated = await roster_redis_service.delete_user(user_id, actor_email=actor_email)
    audit_logs = await roster_redis_service.get_audit_logs()
    return {
        "users": updated,
        "audit_logs": audit_logs
    }
