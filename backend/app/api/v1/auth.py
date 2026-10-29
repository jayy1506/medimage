from fastapi import APIRouter, Depends
from pydantic import BaseModel, EmailStr
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter(prefix="/auth", tags=["Authentication"])


class UserProfileResponse(BaseModel):
    id: str
    firebase_uid: str
    email: EmailStr
    full_name: str
    role: str
    status: str
    force_password_change: bool


class SessionResponse(BaseModel):
    user: UserProfileResponse


@router.post("/session", response_model=SessionResponse)
async def validate_session(current_user: User = Depends(get_current_user)):
    """
    Validates Firebase Bearer token and returns authenticated user profile
    synced from the hosted PostgreSQL database.
    """
    return {
        "user": {
            "id": str(current_user.id),
            "firebase_uid": current_user.firebase_uid,
            "email": current_user.email,
            "full_name": current_user.full_name,
            "role": current_user.role,
            "status": current_user.status,
            "force_password_change": current_user.force_password_change
        }
    }
