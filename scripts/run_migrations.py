#!/usr/bin/env python3
"""
scripts/run_migrations.py
Executes SQL migration files against the hosted PostgreSQL database (Supabase).
"""

import os
import sys
import glob

try:
    import psycopg2
except ImportError:
    print("Missing dependency: psycopg2-binary")
    print("Please install: pip install psycopg2-binary")
    sys.exit(1)


def run_migrations(db_url: str):
    print(f"[MIGRATION] Connecting to PostgreSQL at: {db_url.split('@')[-1] if '@' in db_url else 'specified host'}")
    conn = psycopg2.connect(db_url)
    conn.autocommit = True
    cursor = conn.cursor()

    migration_files = sorted(glob.glob(os.path.join(os.path.dirname(__file__), "migrations", "*.sql")))
    if not migration_files:
        print("[MIGRATION] No SQL migration files found in scripts/migrations/.")
        return

    for sql_file in migration_files:
        filename = os.path.basename(sql_file)
        print(f"[MIGRATION] Applying: {filename}...")
        with open(sql_file, "r", encoding="utf-8") as f:
            sql_content = f.read()
        cursor.execute(sql_content)
        print(f"[MIGRATION] Successfully executed: {filename}")

    # Verify key tables exist
    cursor.execute("""
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        ORDER BY table_name;
    """)
    tables = [row[0] for row in cursor.fetchall()]
    print(f"\n[VERIFICATION] Public tables in hosted database ({len(tables)} tables):")
    for t in tables:
        print(f"  ✓ {t}")

    cursor.close()
    conn.close()
    print("\n[MIGRATION] All database migrations applied successfully!")


if __name__ == "__main__":
    db_conn_str = os.environ.get("DIRECT_DATABASE_URL") or os.environ.get("DATABASE_URL")
    if not db_conn_str:
        print("[ERROR] DATABASE_URL or DIRECT_DATABASE_URL environment variable is required.")
        sys.exit(1)
    run_migrations(db_conn_str)
