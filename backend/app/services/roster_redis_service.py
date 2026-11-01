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
        "email": "aryagawate5@gmail.com",
        "full_name": "Arya Gawate",
        "role": "admin",
        "status": "pending_first_login",
        "temporary_password": "Feat@123",
        "force_password_change": True,
        "created_at": "2026-10-31T00:00:00Z"
    },
    {
        "id": "u-3",
        "email": "jaythakre128@gmail.com",
        "full_name": "Dr. Jay Thakre",
        "role": "faculty",
        "status": "active",
        "temporary_password": "JAY!@#$",
        "force_password_change": False,
        "created_at": "2026-10-30T00:00:00Z"
    },
    {
        "id": "u-4",
        "email": "cheekuv1523@gmail.com",
        "full_name": "Cheeku V",
        "role": "student",
        "status": "active",
        "temporary_password": "Cheeku1523",
        "force_password_change": False,
        "created_at": "2026-10-30T00:00:00Z"
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

    async def _sync_to_firebase(self, email: str, password: str = "Feat@123") -> bool:
        """
        Provisions user into Firebase Console via Identity Toolkit API
        and immediately dispatches password setup/change link to their mailbox.
        """
        api_key = settings.FIREBASE_API_KEY
        signup_url = f"https://identitytoolkit.googleapis.com/v1/accounts:signUp?key={api_key}"
        reset_url = f"https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key={api_key}"
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                res = await client.post(signup_url, json={"email": email, "password": password, "returnSecureToken": False})
                if res.status_code == 200:
                    print(f"[FIREBASE] Successfully added user to Firebase Console: {email}")
                else:
                    err = res.json().get("error", {}).get("message", "")
                    if "EMAIL_EXISTS" in err:
                        print(f"[FIREBASE] User already exists in Firebase Console: {email}")
                    else:
                        print(f"[FIREBASE] Notice: {err}")

                # Automatically trigger official password setup/change email from Firebase to user
                try:
                    mail_res = await client.post(reset_url, json={"requestType": "PASSWORD_RESET", "email": email})
                    if mail_res.status_code == 200:
                        print(f"[FIREBASE] Password setup email dispatched to user inbox: {email}")
                    else:
                        print(f"[FIREBASE] Password reset email dispatch HTTP {mail_res.status_code}")
                except Exception as m_err:
                    print(f"[FIREBASE] Email dispatch exception for {email}: {m_err}")

                return True
        except Exception as e:
            print(f"[FIREBASE] Sync exception: {e}")
        return False

    async def _update_firebase_password(self, email: str, old_password: str, new_password: str) -> bool:
        """
        Syncs newly chosen password into Firebase Auth using Identity Toolkit.
        """
        api_key = settings.FIREBASE_API_KEY
        login_url = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={api_key}"
        update_url = f"https://identitytoolkit.googleapis.com/v1/accounts:update?key={api_key}"
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                token = None
                # Try signing in with previous known password or fallback defaults
                for candidate in [old_password, "Feat@123", "Jay1523", "Cheeku1523", "JAY!@#$"]:
                    if not candidate:
                        continue
                    res = await client.post(login_url, json={"email": email, "password": candidate, "returnSecureToken": True})
                    if res.status_code == 200:
                        token = res.json().get("idToken")
                        break

                if token:
                    up_res = await client.post(update_url, json={"idToken": token, "password": new_password, "returnSecureToken": True})
                    if up_res.status_code == 200:
                        print(f"[FIREBASE] Successfully synced updated password to Firebase Auth for {email}")
                        return True
                    else:
                        print(f"[FIREBASE] Update password status: {up_res.status_code}")
        except Exception as e:
            print(f"[FIREBASE] Exception while updating password: {e}")
        return False

    async def _delete_from_firebase(self, email: str, known_password: Optional[str] = None) -> bool:
        """
        Deletes user from Firebase Auth using Identity Toolkit accounts:delete.
        """
        api_key = settings.FIREBASE_API_KEY
        login_url = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={api_key}"
        delete_url = f"https://identitytoolkit.googleapis.com/v1/accounts:delete?key={api_key}"
        
        candidates = [known_password, "Feat@123", "Jay1523", "Cheeku1523", "JAY!@#$"]
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                token = None
                for pwd in candidates:
                    if not pwd:
                        continue
                    res = await client.post(login_url, json={"email": email, "password": pwd, "returnSecureToken": True})
                    if res.status_code == 200:
                        token = res.json().get("idToken")
                        break
                
                if token:
                    del_res = await client.post(delete_url, json={"idToken": token})
                    if del_res.status_code == 200:
                        print(f"[FIREBASE] Successfully deleted {email} from Firebase Auth.")
                        return True
                    else:
                        print(f"[FIREBASE] accounts:delete returned {del_res.status_code}")
        except Exception as e:
            print(f"[FIREBASE] accounts:delete exception for {email}: {e}")
        return False

    async def add_user(self, user: Dict[str, Any], actor_email: str = "jthakre62@gmail.com") -> List[Dict[str, Any]]:
        # Fetch current roster safely
        roster = await self.get_roster()
        user["temporary_password"] = user.get("temporary_password") or "Feat@123"
        user["force_password_change"] = user.get("force_password_change", True)
        user["status"] = user.get("status", "pending_first_login")

        # Merge new user into roster (deduplicating by email)
        email_clean = user["email"].strip().lower()
        updated_roster = [u for u in roster if u["email"].strip().lower() != email_clean]
        updated_roster.insert(0, user)

        # Always update in-memory state immediately
        self._in_memory_roster = updated_roster

        # Persist to Upstash Redis
        await self._redis_set(self.roster_key, updated_roster)

        # Provision into Firebase Console & dispatch setup email
        await self._sync_to_firebase(user["email"], user["temporary_password"])

        # Audit log
        await self.add_audit_log({
            "id": f"aud-{int(id(user))}",
            "actor_email": actor_email,
            "action": "INVITE_USER",
            "target": user["email"],
            "timestamp": "Just now",
            "ip": "127.0.0.1",
            "details": f"Added {user.get('role', 'user')} {user.get('full_name')} with initial Feat@123 and dispatched Firebase password change email"
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

    async def update_user_role(self, user_id: str, new_role: str, actor_email: str = "jthakre62@gmail.com") -> List[Dict[str, Any]]:
        roster = await self.get_roster()
        target_email = ""
        old_role = ""
        for u in roster:
            if u["id"] == user_id:
                # Protect root super-admin from demotion
                if u.get("email", "").lower() in ["jthakre62@gmail.com", "jthakr62@gmail.com"]:
                    return roster
                old_role = u.get("role", "student")
                u["role"] = new_role
                target_email = u.get("email", "")
                break
        self._in_memory_roster = roster
        await self._redis_set(self.roster_key, roster)
        if target_email:
            await self.add_audit_log({
                "id": f"aud-role-{user_id}-{int(id(new_role))}",
                "actor_email": actor_email,
                "action": "UPDATE_ROLE",
                "target": target_email,
                "timestamp": "Just now",
                "ip": "127.0.0.1",
                "details": f"Institutional role updated from {old_role} to {new_role}"
            })
        return self._in_memory_roster

    async def reset_user_password(self, user_id: str, new_password: str = "Feat@123", actor_email: str = "jthakre62@gmail.com") -> List[Dict[str, Any]]:
        roster = await self.get_roster()
        target_email = ""
        for u in roster:
            if u["id"] == user_id:
                u["temporary_password"] = new_password
                u["force_password_change"] = True
                u["status"] = "pending_first_login"
                target_email = u["email"]
                break
        self._in_memory_roster = roster
        await self._redis_set(self.roster_key, roster)
        if target_email:
            # Trigger Firebase password reset email to user inbox
            api_key = settings.FIREBASE_API_KEY
            reset_url = f"https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key={api_key}"
            try:
                async with httpx.AsyncClient(timeout=8.0) as client:
                    await client.post(reset_url, json={"requestType": "PASSWORD_RESET", "email": target_email})
            except Exception as e:
                print(f"[FIREBASE] Reset email exception for {target_email}: {e}")

            await self.add_audit_log({
                "id": f"aud-reset-{user_id}",
                "actor_email": actor_email,
                "action": "RESET_PASSWORD",
                "target": target_email,
                "timestamp": "Just now",
                "ip": "127.0.0.1",
                "details": f"Password reset to common default ({new_password}) and Firebase email dispatched"
            })
        return self._in_memory_roster

    async def change_user_password(self, email: str, new_password: str) -> bool:
        roster = await self.get_roster()
        matched = False
        old_password = "Feat@123"
        for u in roster:
            if u["email"].lower() == email.lower():
                old_password = u.get("temporary_password", "Feat@123")
                u["temporary_password"] = new_password
                u["force_password_change"] = False
                u["status"] = "active"
                matched = True
                break
        if matched:
            self._in_memory_roster = roster
            await self._redis_set(self.roster_key, roster)
            
            # Sync new password directly to Firebase Auth Console
            await self._update_firebase_password(email, old_password, new_password)

            await self.add_audit_log({
                "id": f"aud-change-{hash(email)}",
                "actor_email": email,
                "action": "CHANGE_PASSWORD_FIRST_LOGIN",
                "target": email,
                "timestamp": "Just now",
                "ip": "127.0.0.1",
                "details": "User successfully set personal password on first login. Status set to active."
            })
            return True
        return False

    async def delete_user(self, user_id: str, actor_email: str = "jthakre62@gmail.com") -> List[Dict[str, Any]]:
        roster = await self.get_roster()
        target_email = ""
        known_pwd = None
        user_id_clean = user_id.strip().lower()
        for u in roster:
            if str(u.get("id", "")).lower() == user_id_clean or str(u.get("email", "")).lower() == user_id_clean:
                target_email = u.get("email", "")
                known_pwd = u.get("temporary_password")
                break

        # Never delete root admin
        if target_email.lower() == "jthakre62@gmail.com":
            return roster

        roster = [
            u for u in roster 
            if str(u.get("id", "")).lower() != user_id_clean and str(u.get("email", "")).lower() != user_id_clean
        ]
        self._in_memory_roster = roster
        await self._redis_set(self.roster_key, roster)

        # Remove from Firebase Auth directly using Identity Toolkit REST API
        if target_email:
            await self._delete_from_firebase(target_email, known_pwd)

            await self.add_audit_log({
                "id": f"aud-del-{hash(user_id)}",
                "actor_email": actor_email,
                "action": "DELETE_USER",
                "target": target_email,
                "timestamp": "Just now",
                "ip": "127.0.0.1",
                "details": f"Permanently removed {target_email} from course roster and system"
            })
        return self._in_memory_roster

    async def add_audit_log(self, entry: Dict[str, Any]) -> List[Dict[str, Any]]:
        logs = await self.get_audit_logs()
        entry.setdefault("timestamp", "Just now")
        entry.setdefault("ip", "127.0.0.1")
        logs.insert(0, entry)
        # Retain last 100 audit events in Redis
        logs = logs[:100]
        await self._redis_set(self.audit_key, logs)
        return logs

    async def get_audit_logs(self) -> List[Dict[str, Any]]:
        success, data, key_exists = await self._redis_get_safe(self.audit_key)
        if success and key_exists and isinstance(data, list):
            return data
        if success and not key_exists:
            await self._redis_set(self.audit_key, INITIAL_AUDIT_LOGS)
            return INITIAL_AUDIT_LOGS
        return INITIAL_AUDIT_LOGS

    async def get_user_progress(self, email: str) -> Dict[str, Any]:
        """
        Retrieves user-specific dynamic progress from Upstash Redis.
        If a new user logs in, returns a fresh progress state initialized to ZERO.
        """
        clean_email = email.strip().lower()
        key = f"medimage:progress:{clean_email}"
        success, data, key_exists = await self._redis_get_safe(key)
        if success and key_exists and isinstance(data, dict):
            return data
        
        # Default fresh state: 0% completion for new users
        default_progress = {
            "email": clean_email,
            "completed_topics": [],
            "module_scores": {},
            "attempts": {},
            "cleared_modules": [],
            "last_updated": "2026-10-30T00:00:00Z"
        }
        return default_progress

    async def update_user_progress(
        self,
        email: str,
        topic_slug: Optional[str] = None,
        is_completed: Optional[bool] = None,
        module_id: Optional[str] = None,
        score_pct: Optional[float] = None
    ) -> Dict[str, Any]:
        """
        Dynamically updates user progress for topics and module assessments.
        """
        clean_email = email.strip().lower()
        key = f"medimage:progress:{clean_email}"
        progress = await self.get_user_progress(clean_email)

        completed_topics = set(progress.get("completed_topics", []))
        module_scores = dict(progress.get("module_scores", {}))
        attempts = dict(progress.get("attempts", {}))
        cleared_modules = set(progress.get("cleared_modules", []))

        # 1. Topic completion update
        if topic_slug:
            if is_completed is None or is_completed:
                completed_topics.add(topic_slug)
            else:
                completed_topics.discard(topic_slug)

        # 2. Module assessment update (>75.0% Pass Rule)
        if module_id is not None and score_pct is not None:
            attempts[module_id] = attempts.get(module_id, 0) + 1
            prev_best = module_scores.get(module_id, 0.0)
            module_scores[module_id] = max(prev_best, float(score_pct))
            if float(score_pct) > 75.0:
                cleared_modules.add(module_id)

        updated_data = {
            "email": clean_email,
            "completed_topics": list(completed_topics),
            "module_scores": module_scores,
            "attempts": attempts,
            "cleared_modules": list(cleared_modules),
            "last_updated": httpx.Response(200).headers.get("date", "Just now")
        }

        await self._redis_set(key, updated_data)
        return updated_data

    async def reset_user_progress(self, email: str) -> Dict[str, Any]:
        clean_email = email.strip().lower()
        key = f"medimage:progress:{clean_email}"
        reset_data = {
            "email": clean_email,
            "completed_topics": [],
            "module_scores": {},
            "attempts": {},
            "cleared_modules": [],
            "last_updated": "2026-10-30T00:00:00Z"
        }
        await self._redis_set(key, reset_data)
        return reset_data

    async def get_username_by_email(self, email: str) -> Optional[str]:
        roster = await self.get_roster()
        clean_email = email.strip().lower()
        for u in roster:
            if u.get("email", "").strip().lower() == clean_email:
                return u.get("username") or u.get("full_name") or None
        return None

    async def update_username_by_email(self, email: str, username: str) -> bool:
        roster = await self.get_roster()
        clean_email = email.strip().lower()
        clean_user = username.strip()
        found = False
        for u in roster:
            if u.get("email", "").strip().lower() == clean_email:
                u["username"] = clean_user
                if not u.get("full_name") or u.get("full_name").lower() in ["student", "scholar", "user"]:
                    u["full_name"] = clean_user
                found = True
                break
        if not found:
            # If not in roster, create an entry so their username is remembered in the database
            roster.append({
                "id": f"u-{abs(hash(clean_email))}",
                "email": clean_email,
                "full_name": clean_user,
                "username": clean_user,
                "role": "student",
                "status": "active",
                "temporary_password": "",
                "force_password_change": False,
                "created_at": "2026-11-01T00:00:00Z"
            })
            found = True

        self._in_memory_roster = roster
        await self._redis_set(self.roster_key, roster)
        return True

roster_redis_service = RosterRedisService()

