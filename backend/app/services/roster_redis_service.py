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
        self._in_memory_roster: List[Dict[str, Any]] = []

    def _merge_rosters(self, primary: List[Dict[str, Any]], secondary: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Merges two roster lists by user email, preserving all users.
        Primary entries override secondary on field collisions, but users
        present only in secondary are retained.
        """
        user_map: Dict[str, Dict[str, Any]] = {}
        for u in secondary:
            if isinstance(u, dict) and u.get("email"):
                user_map[u["email"].lower()] = dict(u)
        for u in primary:
            if isinstance(u, dict) and u.get("email"):
                em = u["email"].lower()
                if em in user_map:
                    # Update fields while preserving any custom password
                    merged = dict(user_map[em])
                    merged.update(u)
                    user_map[em] = merged
                else:
                    user_map[em] = dict(u)
        return list(user_map.values())

    async def _redis_get_safe(self, key: str) -> tuple[bool, Optional[Any], bool]:
        """
        Returns (success: bool, data: Optional[Any], key_exists: bool).
        - success=True, key_exists=True: Redis returned valid key data.
        - success=True, key_exists=False: Redis confirmed the key does not exist (result is null).
        - success=False: Network failure, timeout, or HTTP error. DO NOT assume key is empty!
        """
        if not self.redis_url or not self.redis_token:
            return (False, None, False)
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                res = await client.get(
                    f"{self.redis_url}/get/{key}",
                    headers={"Authorization": f"Bearer {self.redis_token}"}
                )
                if res.status_code == 200:
                    body = res.json()
                    val = body.get("result")
                    if val is None:
                        return (True, None, False)
                    return (True, json.loads(val), True)
                else:
                    print(f"[REDIS] HTTP {res.status_code} while reading {key}")
                    return (False, None, False)
        except Exception as e:
            print(f"[REDIS] Error reading {key}: {e}")
            return (False, None, False)

    async def _redis_set(self, key: str, data: Any) -> bool:
        if not self.redis_url or not self.redis_token:
            return False
        val_str = json.dumps(data)
        for attempt in range(3):
            try:
                async with httpx.AsyncClient(timeout=10.0) as client:
                    res = await client.post(
                        f"{self.redis_url}/set/{key}",
                        headers={"Authorization": f"Bearer {self.redis_token}"},
                        content=val_str
                    )
                    if res.status_code == 200:
                        return True
            except Exception as e:
                print(f"[REDIS] Set attempt {attempt + 1} failed for {key}: {e}")
        return False

    async def get_roster(self) -> List[Dict[str, Any]]:
        success, data, key_exists = await self._redis_get_safe(self.roster_key)

        if success and key_exists and isinstance(data, list) and len(data) > 0:
            # Successfully read existing roster from Redis
            # Merge with any local in-memory users to guarantee zero loss
            merged = self._merge_rosters(data, self._in_memory_roster)
            has_changes = False
            for u in merged:
                if "temporary_password" not in u:
                    u["temporary_password"] = "Jay1523" if "jthakre" in u.get("email", "") else "Feat@123"
                    has_changes = True
                if "force_password_change" not in u:
                    u["force_password_change"] = False if "jthakre" in u.get("email", "") else True
                    has_changes = True

            self._in_memory_roster = merged
            if has_changes or len(merged) > len(data):
                await self._redis_set(self.roster_key, merged)
            return self._in_memory_roster

        if success and not key_exists:
            # Key confirmed NOT in Redis (brand new fresh instance)
            if self._in_memory_roster:
                await self._redis_set(self.roster_key, self._in_memory_roster)
                return self._in_memory_roster
            # First initialization seed
            await self._redis_set(self.roster_key, INITIAL_ROSTER)
            self._in_memory_roster = list(INITIAL_ROSTER)
            return self._in_memory_roster

        # If network/timeout failed (success=False), NEVER overwrite Redis with INITIAL_ROSTER!
        print("[REDIS] Warning: Using in-memory roster fallback due to transient Redis read issue.")
        if not self._in_memory_roster:
            self._in_memory_roster = list(INITIAL_ROSTER)
        return self._in_memory_roster

    async def add_user(self, user: Dict[str, Any], actor_email: str = "jthakre62@gmail.com") -> List[Dict[str, Any]]:
        # Fetch current roster safely
        roster = await self.get_roster()
        user["temporary_password"] = user.get("temporary_password") or "Feat@123"
        user["force_password_change"] = user.get("force_password_change", True)

        # Merge new user into roster (deduplicating by email)
        email_clean = user["email"].strip().lower()
        updated_roster = [u for u in roster if u["email"].strip().lower() != email_clean]
        updated_roster.insert(0, user)

        # Always update in-memory state immediately
        self._in_memory_roster = updated_roster

        # Persist to Upstash Redis
        await self._redis_set(self.roster_key, updated_roster)

        # Audit log
        await self.add_audit_log({
            "id": f"aud-{int(id(user))}",
            "actor_email": actor_email,
            "action": "INVITE_USER",
            "target": user["email"],
            "timestamp": "Just now",
            "ip": "127.0.0.1",
            "details": f"Added {user.get('role', 'user')} {user.get('full_name')} with default password Feat@123"
        })
        return self._in_memory_roster

    async def update_user_status(self, user_id: str, new_status: str, actor_email: str = "jthakre62@gmail.com") -> List[Dict[str, Any]]:
        roster = await self.get_roster()
        target_email = ""
        for u in roster:
            if u["id"] == user_id:
                u["status"] = new_status
                target_email = u["email"]
                break
        self._in_memory_roster = roster
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
        return self._in_memory_roster

    async def reset_user_password(self, user_id: str, new_password: str = "Feat@123", actor_email: str = "jthakre62@gmail.com") -> List[Dict[str, Any]]:
        roster = await self.get_roster()
        target_email = ""
        for u in roster:
            if u["id"] == user_id:
                u["temporary_password"] = new_password
                u["force_password_change"] = True
                target_email = u["email"]
                break
        self._in_memory_roster = roster
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
        return self._in_memory_roster

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
            self._in_memory_roster = roster
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
        self._in_memory_roster = roster
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
        return self._in_memory_roster

    async def get_audit_logs(self) -> List[Dict[str, Any]]:
        success, data, key_exists = await self._redis_get_safe(self.audit_key)
        if success and key_exists and isinstance(data, list):
            return data
        if success and not key_exists:
            await self._redis_set(self.audit_key, INITIAL_AUDIT_LOGS)
            return INITIAL_AUDIT_LOGS
        return INITIAL_AUDIT_LOGS

    async def add_audit_log(self, entry: Dict[str, Any]) -> List[Dict[str, Any]]:
        logs = await self.get_audit_logs()
        logs.insert(0, entry)
        logs = logs[:50]
        await self._redis_set(self.audit_key, logs)
        return logs

roster_redis_service = RosterRedisService()
