#!/usr/bin/env python3
"""
scripts/bootstrap_admin.py
One-time idempotent super-admin provisioner for Medical Text and Image Processing platform.
Enforces Invite-Only access control:
1. Creates admin in Firebase Auth via Firebase Admin SDK.
2. Injects custom claims: {"role": "admin"}.
3. Mirrors account into hosted PostgreSQL `users` table with status='active'.
4. Logs event into `audit_logs`.
5. Prints initial password setup link.
"""

import os
import sys
import json
import base64
import argparse
from datetime import datetime

try:
    import firebase_admin
    from firebase_admin import auth as fb_auth, credentials
    import psycopg2
    from psycopg2.extras import RealDictCursor
except ImportError as e:
    print(f"Missing required dependency: {e}")
    print("Please run: pip install firebase-admin psycopg2-binary")
    sys.exit(1)


def init_firebase():
    """Initializes Firebase Admin SDK from environment variable or credentials file."""
    if firebase_admin._apps:
        return firebase_admin.get_app()

    b64_creds = os.environ.get("FIREBASE_SERVICE_ACCOUNT_B64")
    creds_path = os.environ.get("FIREBASE_SERVICE_ACCOUNT_PATH", "serviceAccountKey.json")

    if b64_creds:
        cred_dict = json.loads(base64.b64decode(b64_creds).decode("utf-8"))
        cred = credentials.Certificate(cred_dict)
    elif os.path.exists(creds_path):
        cred = credentials.Certificate(creds_path)
    else:
        raise ValueError(
            "Neither FIREBASE_SERVICE_ACCOUNT_B64 nor FIREBASE_SERVICE_ACCOUNT_PATH found."
        )

    return firebase_admin.initialize_app(cred)


def bootstrap_admin(email: str, full_name: str, db_url: str):
    print(f"[BOOTSTRAP] Initiating admin onboarding for: {email}")

    # 1. Connect to Hosted PostgreSQL Database
    conn = psycopg2.connect(db_url)
    conn.autocommit = True
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    # 2. Check if an admin already exists in Postgres
    cursor.execute("SELECT id, email, role, status FROM users WHERE role = 'admin' LIMIT 1;")
    existing_admin = cursor.fetchone()
    if existing_admin:
        print(f"[BOOTSTRAP] Admin account already exists: {existing_admin['email']} (ID: {existing_admin['id']})")
        print("[BOOTSTRAP] Skipping creation to maintain single-admin bootstrap security.")
        cursor.close()
        conn.close()
        return

    # 3. Create or Fetch User in Firebase Auth
    init_firebase()
    try:
        user_record = fb_auth.get_user_by_email(email)
        print(f"[BOOTSTRAP] Found existing Firebase Auth account: {user_record.uid}")
    except fb_auth.UserNotFoundError:
        user_record = fb_auth.create_user(
            email=email,
            display_name=full_name,
            email_verified=True,
            disabled=False
        )
        print(f"[BOOTSTRAP] Created new Firebase Auth account: {user_record.uid}")

    # 4. Set Custom Claims: {"role": "admin"}
    fb_auth.set_custom_user_claims(user_record.uid, {"role": "admin"})
    print("[BOOTSTRAP] Injected Firebase custom claims: {'role': 'admin'}")

    # 5. Insert mirrored user into hosted PostgreSQL users table
    cursor.execute("""
        INSERT INTO users (firebase_uid, email, full_name, role, status, force_password_change)
        VALUES (%s, %s, %s, 'admin', 'active', FALSE)
        ON CONFLICT (firebase_uid) DO UPDATE 
        SET role = 'admin', status = 'active'
        RETURNING id;
    """, (user_record.uid, email, full_name))
    db_user = cursor.fetchone()
    admin_uuid = db_user["id"]
    print(f"[BOOTSTRAP] Mirrored user into hosted PostgreSQL `users` table: {admin_uuid}")

    # 6. Record Audit Log Entry
    cursor.execute("""
        INSERT INTO audit_logs (actor_id, action, target_type, target_id, metadata, ip_address)
        VALUES (%s, 'BOOTSTRAP_ADMIN', 'USER', %s, %s, '127.0.0.1');
    """, (admin_uuid, str(admin_uuid), json.dumps({"email": email, "full_name": full_name})))
    print("[BOOTSTRAP] Recorded action in `audit_logs` table.")

    # 7. Generate Password Reset / Setup Link
    reset_link = fb_auth.generate_password_reset_link(email)
    print("\n" + "=" * 70)
    print("SUCCESS: Super-Admin Bootstrapped Successfully!")
    print(f"Email: {email}")
    print(f"Role: admin")
    print(f"Password Setup Link: {reset_link}")
    print("=" * 70 + "\n")

    cursor.close()
    conn.close()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Bootstrap initial platform super-admin.")
    parser.add_argument("--email", default=os.environ.get("INITIAL_ADMIN_EMAIL", "admin.fet@adani.edu.in"), help="Admin email")
    parser.add_argument("--name", default=os.environ.get("INITIAL_ADMIN_NAME", "FET System Administrator"), help="Admin full name")
    parser.add_argument("--db", default=os.environ.get("DIRECT_DATABASE_URL") or os.environ.get("DATABASE_URL"), help="PostgreSQL connection string")
    args = parser.parse_args()

    if not args.db:
        print("[ERROR] DATABASE_URL or DIRECT_DATABASE_URL environment variable is required.")
        sys.exit(1)

    bootstrap_admin(args.email, args.name, args.db)
