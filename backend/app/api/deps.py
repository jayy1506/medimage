from typing import List, Callable
from fastapi import Depends, HTTPException, status, Header
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.session import get_db
from app.core.firebase_admin import verify_firebase_token
from app.models.user import User


async def get_current_user(
    authorization: str = Header(..., description="Firebase Bearer ID Token"),
    db: AsyncSession = Depends(get_db)
) -> User:
    """
    Validates Firebase Bearer token and asserts user exists and is active
    in the hosted PostgreSQL `users` table.
    Enforces Invite-Only access control:
    - Invalid/expired token -> 401 Unauthorized
    - Valid token but user not in DB -> 403 Forbidden
    - User disabled -> 403 Forbidden
    """
    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header must start with 'Bearer '",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = authorization.split("Bearer ")[1].strip()
    decoded_token = verify_firebase_token(token)
    firebase_uid = decoded_token.get("uid")

    if not firebase_uid:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token missing UID payload.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Query hosted PostgreSQL database
    query = select(User).where(User.firebase_uid == firebase_uid)
    result = await db.execute(query)
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account not authorized in platform database. This course is strictly invite-only."
        )

    if user.status == "disabled":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your user account has been deactivated. Contact your department administrator."
        )

    return user


def require_role(allowed_roles: List[str]) -> Callable:
    """Dependency factory checking if current user has an authorized role."""
    async def role_checker(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access forbidden: requires one of {allowed_roles} roles. Your role is '{current_user.role}'."
            )
        return current_user
    return role_checker
