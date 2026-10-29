import os
import json
import base64
from typing import Optional, Dict, Any
import firebase_admin
from firebase_admin import auth as fb_auth, credentials
from fastapi import HTTPException, status
from app.core.config import settings

_firebase_app: Optional[firebase_admin.App] = None


def get_firebase_app() -> firebase_admin.App:
    """Initializes and returns the singleton Firebase Admin App."""
    global _firebase_app
    if _firebase_app is not None:
        return _firebase_app

    if firebase_admin._apps:
        _firebase_app = firebase_admin.get_app()
        return _firebase_app

    b64_creds = settings.FIREBASE_SERVICE_ACCOUNT_B64
    creds_path = os.environ.get("FIREBASE_SERVICE_ACCOUNT_PATH", "serviceAccountKey.json")

    if b64_creds:
        try:
            cred_dict = json.loads(base64.b64decode(b64_creds).decode("utf-8"))
            cred = credentials.Certificate(cred_dict)
            _firebase_app = firebase_admin.initialize_app(cred)
            return _firebase_app
        except Exception as e:
            print(f"[FIREBASE_ADMIN] Warning: Failed to parse b64 credentials: {e}")

    if os.path.exists(creds_path):
        cred = credentials.Certificate(creds_path)
        _firebase_app = firebase_admin.initialize_app(cred)
        return _firebase_app

    # Fallback to default app credentials or mock mode in test environment
    try:
        _firebase_app = firebase_admin.initialize_app(options={"projectId": settings.FIREBASE_PROJECT_ID})
    except Exception as e:
        print(f"[FIREBASE_ADMIN] Notice: Initialized in mock/dev mode ({e})")

    return _firebase_app


def verify_firebase_token(token: str) -> Dict[str, Any]:
    """
    Verifies a Firebase ID token.
    Returns decoded token dictionary with uid and custom claims.
    Raises HTTPException(401) on invalid or expired token.
    """
    get_firebase_app()
    try:
        decoded = fb_auth.verify_id_token(token, check_revoked=True)
        return decoded
    except fb_auth.RevokedIdTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session revoked. Please log in again.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except fb_auth.ExpiredIdTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication token expired. Please refresh session.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid authentication token: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )


def set_user_role_claim(uid: str, role: str) -> None:
    """Sets custom claim `role` on Firebase user."""
    get_firebase_app()
    fb_auth.set_custom_user_claims(uid, {"role": role})
