import json
import httpx
from typing import List, Dict, Any, Optional
from app.core.config import settings

INITIAL_ROSTER = [
    {
        "id": "u-1",
        "email": "jthakre62@gmail.com",
        "full_name": "Jay Thakre",
        "role": "admin",
        "status": "active",
        "temporary_password": "Jay1523",
        "force_password_change": False,
        "created_at": "2026-10-29T10:00:00Z"
    },
    {
        "id": "u-2",
        "email": "prof.radiology@adani.edu.in",
        "full_name": "Dr. R. K. Sharma",
        "role": "faculty",
        "status": "active",
        "temporary_password": "Feat@123",
        "force_password_change": False,
        "created_at": "2026-10-29T10:30:00Z"
    },
    {
        "id": "u-3",
        "email": "dr.patel@adani.edu.in",
        "full_name": "Dr. Anjali Patel",
        "role": "faculty",
        "status": "active",
        "temporary_password": "Feat@123",
        "force_password_change": False,
        "created_at": "2026-10-29T11:15:00Z"
    },
    {
        "id": "u-4",
        "email": "aarav.p@adani.edu.in",
        "full_name": "Aarav Patel",
        "role": "student",
        "status": "active",
        "temporary_password": "Feat@123",
        "force_password_change": False,
        "created_at": "2026-10-29T12:00:00Z"
    },
    {
        "id": "u-5",
        "email": "diya.s@adani.edu.in",
        "full_name": "Diya Sharma",
        "role": "student",
        "status": "active",
        "temporary_password": "Feat@123",
        "force_password_change": False,
        "created_at": "2026-10-29T12:05:00Z"
    },
    {
        "id": "u-6",
        "email": "kabir.m@adani.edu.in",
        "full_name": "Kabir Mehta",
        "role": "student",
        "status": "pending_first_login",
        "temporary_password": "Feat@123",
        "force_password_change": True,
        "created_at": "2026-10-29T13:40:00Z"
    }
]

INITIAL_AUDIT_LOGS = [
    {
        "id": "aud-1",
        "actor_email": "jthakre62@gmail.com",
        "action": "BOOTSTRAP_ADMIN",
        "target": "jthakre62@gmail.com",
        "timestamp": "Just now",
        "ip": "127.0.0.1",
        "details": "Super-Admin access initialized with custom claims"
    },
    {
        "id": "aud-2",
        "actor_email": "jthakre62@gmail.com",
        "action": "INVITE_USER",
        "target": "kabir.m@adani.edu.in",
        "timestamp": "12 mins ago",
        "ip": "103.21.124.2",
        "details": "Provisioned student seat for AIDS 12605.1 with default password Feat@123"
    }
]

class RosterRedisService:
    def __init__(self):
        self.redis_url = settings.UPSTASH_REDIS_REST_URL
        self.redis_token = settings.UPSTASH_REDIS_REST_TOKEN
        self.roster_key = "medimage:roster:users"
        self.audit_key = "medimage:roster:audit_logs"
        self.curriculum_key = "medimage:curriculum:modules"

    async def _redis_get(self, key: str) -> Optional[Any]:
        if not self.redis_url or not self.redis_token:
            return None
        try:
            async with httpx.AsyncClient(timeout=4.0) as client:
                res = await client.get(
                    f"{self.redis_url}/get/{key}",
                    headers={"Authorization": f"Bearer {self.redis_token}"}
                )
                if res.status_code == 200:
                    val = res.json().get("result")
                    if val:
                        return json.loads(val)
        except Exception as e:
            print(f"[REDIS] Error reading {key}: {e}")
        return None

    async def _redis_set(self, key: str, data: Any) -> bool:
        if not self.redis_url or not self.redis_token:
            return False
        try:
            val_str = json.dumps(data)
            async with httpx.AsyncClient(timeout=4.0) as client:
                res = await client.post(
                    f"{self.redis_url}/set/{key}",
                    headers={"Authorization": f"Bearer {self.redis_token}"},
                    content=val_str
                )
                return res.status_code == 200
        except Exception as e:
            print(f"[REDIS] Error setting {key}: {e}")
            return False

    async def get_roster(self) -> List[Dict[str, Any]]:
        cached = await self._redis_get(self.roster_key)
        if cached is not None and isinstance(cached, list):
            # Ensure every user has temporary_password field populated
            has_changes = False
            for u in cached:
                if "temporary_password" not in u:
                    u["temporary_password"] = "Jay1523" if "jthakre" in u.get("email", "") else "Feat@123"
                    has_changes = True
                if "force_password_change" not in u:
                    u["force_password_change"] = False if "jthakre" in u.get("email", "") else True
                    has_changes = True
            if has_changes:
                await self._redis_set(self.roster_key, cached)
            return cached

        # Initialize seed in Redis
        await self._redis_set(self.roster_key, INITIAL_ROSTER)
        return INITIAL_ROSTER

    async def add_user(self, user: Dict[str, Any], actor_email: str = "jthakre62@gmail.com") -> List[Dict[str, Any]]:
        roster = await self.get_roster()
        user["temporary_password"] = user.get("temporary_password") or "Feat@123"
        user["force_password_change"] = user.get("force_password_change", True)

        # Avoid duplicate emails
        roster = [u for u in roster if u["email"].lower() != user["email"].lower()]
        roster.insert(0, user)
        await self._redis_set(self.roster_key, roster)

        # Audit log
        await self.add_audit_log({
            "id": f"aud-{int(httpx.Timeout(1).connect or 1000)}",
            "actor_email": actor_email,
            "action": "INVITE_USER",
            "target": user["email"],
            "timestamp": "Just now",
            "ip": "127.0.0.1",
            "details": f"Added {user.get('role', 'user')} {user.get('full_name')} with default password Feat@123"
        })
        return roster

    async def update_user_status(self, user_id: str, new_status: str, actor_email: str = "jthakre62@gmail.com") -> List[Dict[str, Any]]:
        roster = await self.get_roster()
        target_email = ""
        for u in roster:
            if u["id"] == user_id:
                u["status"] = new_status
                target_email = u["email"]
                break
        await self._redis_set(self.roster_key, roster)
        if target_email:
            await self.add_audit_log({
                "id": f"aud-status-{user_id}",
                "actor_email": actor_email,
                "action": "UPDATE_STATUS",
                "target": target_email,
                "timestamp": "Just now",
                "ip": "127.0.0.1",
                "details": f"Status updated to {new_status}"
            })
        return roster

    async def reset_user_password(self, user_id: str, new_password: str = "Feat@123", actor_email: str = "jthakre62@gmail.com") -> List[Dict[str, Any]]:
        roster = await self.get_roster()
        target_email = ""
        for u in roster:
            if u["id"] == user_id:
                u["temporary_password"] = new_password
                u["force_password_change"] = True
                target_email = u["email"]
                break
        await self._redis_set(self.roster_key, roster)
        if target_email:
            await self.add_audit_log({
                "id": f"aud-reset-{user_id}",
                "actor_email": actor_email,
                "action": "RESET_PASSWORD",
                "target": target_email,
                "timestamp": "Just now",
                "ip": "127.0.0.1",
                "details": f"Password reset to common default ({new_password})"
            })
        return roster

    async def change_user_password(self, email: str, new_password: str) -> bool:
        roster = await self.get_roster()
        matched = False
        for u in roster:
            if u["email"].lower() == email.lower():
                u["temporary_password"] = new_password
                u["force_password_change"] = False
                matched = True
                break
        if matched:
            await self._redis_set(self.roster_key, roster)
            await self.add_audit_log({
                "id": f"aud-change-{hash(email)}",
                "actor_email": email,
                "action": "CHANGE_PASSWORD_FIRST_LOGIN",
                "target": email,
                "timestamp": "Just now",
                "ip": "127.0.0.1",
                "details": "User successfully set personal password on first login"
            })
            return True
        return False

    async def delete_user(self, user_id: str, actor_email: str = "jthakre62@gmail.com") -> List[Dict[str, Any]]:
        roster = await self.get_roster()
        target_email = ""
        for u in roster:
            if u["id"] == user_id:
                target_email = u["email"]
                break
        roster = [u for u in roster if u["id"] != user_id]
        await self._redis_set(self.roster_key, roster)
        if target_email:
            await self.add_audit_log({
                "id": f"aud-del-{user_id}",
                "actor_email": actor_email,
                "action": "DELETE_USER",
                "target": target_email,
                "timestamp": "Just now",
                "ip": "127.0.0.1",
                "details": "Removed from course roster in Redis"
            })
        return roster

    async def get_audit_logs(self) -> List[Dict[str, Any]]:
        cached = await self._redis_get(self.audit_key)
        if cached is not None and isinstance(cached, list):
            return cached
        await self._redis_set(self.audit_key, INITIAL_AUDIT_LOGS)
        return INITIAL_AUDIT_LOGS

    async def add_audit_log(self, entry: Dict[str, Any]) -> List[Dict[str, Any]]:
        logs = await self.get_audit_logs()
        logs.insert(0, entry)
        logs = logs[:50]
        await self._redis_set(self.audit_key, logs)
        return logs

roster_redis_service = RosterRedisService()
