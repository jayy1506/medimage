import csv
import io
import json
import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Query
from pydantic import BaseModel, EmailStr
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from firebase_admin import auth as fb_auth

from app.api.deps import require_role
from app.db.session import get_db
from app.models.user import User, AuditLog
from app.core.firebase_admin import set_user_role_claim

router = APIRouter(prefix="/admin", tags=["Admin User Management"])


class CreateUserRequest(BaseModel):
    email: EmailStr
    full_name: str
    role: str = "student"  # "student" | "faculty" | "admin"


class UserStatusUpdateRequest(BaseModel):
    status: str  # "active" | "disabled"


@router.post("/users", status_code=status.HTTP_201_CREATED)
async def invite_user(
    payload: CreateUserRequest,
    current_admin: User = Depends(require_role(["admin"])),
    db: AsyncSession = Depends(get_db)
):
    """
    Provisions a new user account (Admin-only invite flow):
    1. Creates user in Firebase Auth.
    2. Sets Firebase custom claim: {"role": payload.role}.
    3. Inserts into hosted PostgreSQL `users` table with status='pending_first_login'.
    4. Generates password activation link.
    5. Records action in audit_logs.
    """
    if payload.role not in ["student", "faculty", "admin"]:
        raise HTTPException(status_code=400, detail="Invalid role. Must be 'student', 'faculty', or 'admin'.")

    # Check if user already exists in DB
    existing = await db.execute(select(User).where(User.email == payload.email))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="User with this email already exists.")

    try:
        # Create user in Firebase Auth
        fb_user = fb_auth.create_user(
            email=payload.email,
            display_name=payload.full_name,
            email_verified=False,
            disabled=False
        )
    except fb_auth.EmailAlreadyExistsError:
        fb_user = fb_auth.get_user_by_email(payload.email)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Firebase user creation failed: {str(e)}")

    # Set custom claim in Firebase
    set_user_role_claim(fb_user.uid, payload.role)

    # Insert into hosted PostgreSQL
    new_user = User(
        firebase_uid=fb_user.uid,
        email=payload.email,
        full_name=payload.full_name,
        role=payload.role,
        status="pending_first_login",
        force_password_change=True
    )
    db.add(new_user)
    await db.flush()

    # Log in audit_logs
    audit = AuditLog(
        actor_id=current_admin.id,
        action="INVITE_USER",
        target_type="USER",
        target_id=str(new_user.id),
        metadata={"email": payload.email, "role": payload.role, "full_name": payload.full_name}
    )
    db.add(audit)
    await db.commit()
    await db.refresh(new_user)

    # Generate setup link
    try:
        setup_link = fb_auth.generate_password_reset_link(payload.email)
    except Exception:
        setup_link = None

    return {
        "status": "success",
        "message": "User provisioned successfully.",
        "user_id": str(new_user.id),
        "setup_link": setup_link
    }


@router.post("/users/bulk")
async def bulk_invite_users(
    file: UploadFile = File(..., description="CSV with columns: email, full_name, role"),
    current_admin: User = Depends(require_role(["admin"])),
    db: AsyncSession = Depends(get_db)
):
    """
    Bulk provisions users from CSV (e.g. 70-200 students).
    CSV Format:
    email,full_name,role
    student1@adani.edu.in,Aarav Shah,student
    """
    content = await file.read()
    decoded = content.decode("utf-8-sig")
    reader = csv.DictReader(io.StringIO(decoded))

    successful = 0
    failed = 0
    errors = []

    for row_idx, row in enumerate(reader, start=1):
        email = row.get("email", "").strip()
        full_name = row.get("full_name", "").strip()
        role = row.get("role", "student").strip()

        if not email or not full_name:
            failed += 1
            errors.append(f"Row {row_idx}: missing email or full_name")
            continue

        if role not in ["student", "faculty", "admin"]:
            role = "student"

        # Check existing in DB
        res = await db.execute(select(User).where(User.email == email))
        if res.scalar_one_or_none():
            failed += 1
            errors.append(f"Row {row_idx}: {email} already exists")
            continue

        try:
            try:
                fb_user = fb_auth.create_user(email=email, display_name=full_name, disabled=False)
            except fb_auth.EmailAlreadyExistsError:
                fb_user = fb_auth.get_user_by_email(email)

            set_user_role_claim(fb_user.uid, role)

            new_user = User(
                firebase_uid=fb_user.uid,
                email=email,
                full_name=full_name,
                role=role,
                status="pending_first_login",
                force_password_change=True
            )
            db.add(new_user)
            successful += 1
        except Exception as e:
            failed += 1
            errors.append(f"Row {row_idx} ({email}): {str(e)}")

    if successful > 0:
        audit = AuditLog(
            actor_id=current_admin.id,
            action="BULK_INVITE_USERS",
            target_type="BATCH",
            target_id=f"{successful}_users",
            metadata={"successful": successful, "failed": failed}
        )
        db.add(audit)
        await db.commit()

    return {
        "status": "completed",
        "total_processed": successful + failed,
        "successful_invites": successful,
        "failed_invites": failed,
        "errors": errors
    }


@router.get("/users")
async def list_users(
    role: Optional[str] = Query(None, description="Filter by role"),
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=200),
    current_admin: User = Depends(require_role(["admin", "faculty"])),
    db: AsyncSession = Depends(get_db)
):
    """Lists users with pagination."""
    query = select(User)
    if role:
        query = query.where(User.role == role)
    query = query.offset((page - 1) * limit).limit(limit)

    res = await db.execute(query)
    users = res.scalars().all()

    return [
        {
            "id": str(u.id),
            "email": u.email,
            "full_name": u.full_name,
            "role": u.role,
            "status": u.status,
            "created_at": u.created_at.isoformat()
        }
        for u in users
    ]


@router.patch("/users/{user_id}/status")
async def update_user_status(
    user_id: uuid.UUID,
    payload: UserStatusUpdateRequest,
    current_admin: User = Depends(require_role(["admin"])),
    db: AsyncSession = Depends(get_db)
):
    """Enables or disables a user account. Revokes tokens if disabled."""
    if payload.status not in ["active", "disabled"]:
        raise HTTPException(status_code=400, detail="Status must be 'active' or 'disabled'.")

    res = await db.execute(select(User).where(User.id == user_id))
    user = res.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    user.status = payload.status
    if payload.status == "disabled":
        try:
            fb_auth.revoke_refresh_tokens(user.firebase_uid)
        except Exception:
            pass

    audit = AuditLog(
        actor_id=current_admin.id,
        action="UPDATE_USER_STATUS",
        target_type="USER",
        target_id=str(user.id),
        metadata={"new_status": payload.status}
    )
    db.add(audit)
    await db.commit()

    return {"status": "success", "user_id": str(user.id), "new_status": payload.status}


@router.get("/audit-logs")
async def get_audit_logs(
    page: int = Query(1, ge=1),
    limit: int = Query(25, ge=1, le=100),
    current_admin: User = Depends(require_role(["admin"])),
    db: AsyncSession = Depends(get_db)
):
    """Fetches system audit logs (Admin only)."""
    query = select(AuditLog).order_by(AuditLog.created_at.desc()).offset((page - 1) * limit).limit(limit)
    res = await db.execute(query)
    logs = res.scalars().all()

    return [
        {
            "id": str(l.id),
            "actor_id": str(l.actor_id) if l.actor_id else None,
            "action": l.action,
            "target_type": l.target_type,
            "target_id": l.target_id,
            "metadata": l.metadata,
            "created_at": l.created_at.isoformat()
        }
        for l in logs
    ]
