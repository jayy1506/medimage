# Database Architecture & Schema Specification

**Project:** Medical Text and Image Processing Learning Platform (AIDS 12605.1)  
**Institution:** Faculty of Engineering and Technology, Adani Institute of Higher Education and Research (Deemed to be University)  
**Database Engines:** 
- **Primary Relational & Vector Store:** Hosted PostgreSQL 15+ with `pgvector` extension (Supabase Free Tier)
- **High-Speed Cache, Roster & Progress Store:** Upstash Redis Serverless REST API  
**Status:** Approved for Implementation  

---

## 1. Single Source of Truth & Zero Local Storage

Per project guidelines:
- **Zero Local SQLite/JSON Persistence:** No relational data, course outlines, student submissions, or vector indices may reside on local disk.
- **Hosted Supabase PostgreSQL:** All application data, relational mappings, custom role validations, vector embeddings for curriculum retrieval, and formal audit logs reside strictly in the hosted database.
- **Connection Strategy:** Access via pooled connection strings (PgBouncer port `6543`) for stateless web requests and direct connection (`5432`) for running database migrations (`scripts/run_migrations.py`).
- **Upstash Redis Serverless Integration:** Handles fast session caching, student roster state with automatic deduplication, dynamic student progress tracking (`medimage:progress:{email}`), and semantic RAG response caching.

---

## 2. Upstash Redis Schema & Key Design

To support fast client operations and resilient institutional access, Upstash Redis maintains the following key structures:

| Redis Key Pattern | Data Structure | Purpose |
| :--- | :--- | :--- |
| `medimage:roster:users` | JSON List of Objects | Master institutional user roster (Admins, Faculty, Students) with direct active access |
| `medimage:roster:audit_logs` | JSON List of Objects | Rolling window of the last 100 administrative actions (invitations, role edits, resets) |
| `medimage:progress:{clean_email}`| JSON Object | Dynamic student progress (completed topic slugs, module scores, attempt counts, cleared modules) |
| `medimage:curriculum:modules` | JSON List of Objects | Cached syllabus hierarchy and module metadata |
| `medimage:rag:cache:{query_hash}`| JSON String | Cached AI tutor answers (TTL 7 days) to conserve API quotas |

---

## 3. Entity-Relationship Diagram (ERD)

```mermaid
erDiagram
    USERS ||--o{ AUDIT_LOGS : "triggers"
    USERS ||--o{ USER_PROGRESS : "records"
    USERS ||--o{ ATTEMPTS : "submits"
    USERS ||--o{ AI_CONVERSATIONS : "engages"
    USERS ||--o{ MISSION_ATTEMPTS : "completes"
    
    MODULES ||--o{ TOPICS : "contains"
    MODULES ||--o{ ASSESSMENTS : "evaluates"
    MODULES ||--o{ QUESTION_BANK : "pools"
    
    TOPICS ||--o{ TOPIC_SECTIONS : "divides into"
    TOPICS ||--o{ DIAGRAMS : "renders"
    TOPICS ||--o{ VISUAL_ASSETS : "displays"
    TOPICS ||--o{ TOPIC_EMBEDDINGS : "indexes"
    TOPICS ||--o{ CODING_EXERCISES : "practices"
    TOPICS ||--o{ USER_PROGRESS : "tracks"
    
    TOPIC_SECTIONS ||--o| DIAGRAMS : "synchronizes"
    
    ASSESSMENTS ||--o{ ATTEMPTS : "grades"
    QUESTION_BANK ||--o{ CODING_EXERCISES : "categorizes"
    USERS ||--o{ VISUAL_ASSETS : "approves"
```

---

## 4. PostgreSQL DDL Specification

```sql
-- Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- Enum Definitions
CREATE TYPE user_role AS ENUM ('student', 'faculty', 'admin');
CREATE TYPE user_status AS ENUM ('active', 'disabled', 'pending_first_login');
CREATE TYPE question_type AS ENUM ('mcq', 'short_answer', 'coding');
CREATE TYPE difficulty_level AS ENUM ('easy', 'medium', 'hard');
CREATE TYPE asset_status AS ENUM ('draft', 'approved', 'rejected');
CREATE TYPE diagram_type AS ENUM ('mermaid', 'svg', 'interactive_sim');

-- ============================================================================
-- 1. Identity & Audit Tables
-- ============================================================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    firebase_uid VARCHAR(128) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'student',
    status user_status NOT NULL DEFAULT 'active',
    force_password_change BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_firebase_uid ON users(firebase_uid);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    target_type VARCHAR(50) NOT NULL,
    target_id VARCHAR(100) NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    ip_address VARCHAR(45),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_actor ON audit_logs(actor_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- ============================================================================
-- 2. Curriculum & Topic Structure (Modules 1 to 6 + Capstone)
-- ============================================================================

CREATE TABLE modules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    module_number INT UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    theory_hours INT NOT NULL DEFAULT 8,
    co_tags TEXT[] NOT NULL DEFAULT '{}',
    order_index INT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE topics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
    slug VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    order_index INT NOT NULL,
    co_tags TEXT[] NOT NULL DEFAULT '{}',
    read_time_minutes INT NOT NULL DEFAULT 15,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_topics_module_id ON topics(module_id);
CREATE INDEX idx_topics_slug ON topics(slug);

CREATE TABLE diagrams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    diagram_type diagram_type NOT NULL,
    code_or_markup TEXT NOT NULL,
    layer_config JSONB DEFAULT '{}'::jsonb,
    interactive_node_map JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE topic_sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    section_number INT NOT NULL,
    section_type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    content_markdown TEXT NOT NULL,
    formula_latex TEXT,
    linked_diagram_id UUID REFERENCES diagrams(id) ON DELETE SET NULL,
    order_index INT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_topic_section_order UNIQUE (topic_id, order_index)
);

CREATE INDEX idx_topic_sections_topic_id ON topic_sections(topic_id);

-- ============================================================================
-- 3. Visual Assets & Editorial Governance
-- ============================================================================

CREATE TABLE visual_assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    asset_type VARCHAR(50) NOT NULL,
    prompt TEXT,
    model_used VARCHAR(100),
    storage_url TEXT NOT NULL,
    alt_text TEXT NOT NULL,
    license VARCHAR(100) NOT NULL,
    attribution TEXT,
    status asset_status NOT NULL DEFAULT 'approved',
    approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
    approved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_visual_assets_status ON visual_assets(status);
CREATE INDEX idx_visual_assets_topic ON visual_assets(topic_id);

-- ============================================================================
-- 4. RAG Vector Knowledge Store (Curriculum Grounding)
-- ============================================================================

CREATE TABLE topic_embeddings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    section_id UUID REFERENCES topic_sections(id) ON DELETE CASCADE,
    chunk_text TEXT NOT NULL,
    embedding VECTOR(384) NOT NULL, -- sentence-transformers/all-MiniLM-L6-v2 dimension
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Cosine distance index for fast RAG similarity search
CREATE INDEX idx_topic_embeddings_vector ON topic_embeddings 
USING ivfflat (embedding vector_cosine_ops) WITH (lists = 50);

-- ============================================================================
-- 5. Assessments, Question Bank & The >75% Pass Rule
-- ============================================================================

CREATE TABLE question_bank (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
    topic_id UUID REFERENCES topics(id) ON DELETE SET NULL,
    co_tag VARCHAR(10) NOT NULL,
    question_type question_type NOT NULL,
    question_text TEXT NOT NULL,
    options_json JSONB DEFAULT '[]'::jsonb,
    correct_answer_json JSONB NOT NULL,
    explanation TEXT NOT NULL,
    rubric_json JSONB DEFAULT '{}'::jsonb,
    difficulty difficulty_level NOT NULL DEFAULT 'medium',
    is_approved BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_question_bank_module ON question_bank(module_id);
CREATE INDEX idx_question_bank_type ON question_bank(question_type);

CREATE TABLE assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    pass_threshold_pct NUMERIC(5, 2) NOT NULL DEFAULT 75.00,
    time_limit_minutes INT NOT NULL DEFAULT 30,
    num_random_questions INT NOT NULL DEFAULT 15,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
    attempt_number INT NOT NULL,
    score_pct NUMERIC(5, 2) NOT NULL,
    is_passed BOOLEAN GENERATED ALWAYS AS (score_pct > 75.00) STORED,
    answers_json JSONB NOT NULL,
    ai_grading_json JSONB DEFAULT '{}'::jsonb,
    faculty_override_json JSONB DEFAULT '{}'::jsonb,
    started_at TIMESTAMPTZ NOT NULL,
    completed_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_attempts_user_assessment ON attempts(user_id, assessment_id);
CREATE INDEX idx_attempts_score ON attempts(score_pct);

-- View for Student's Best and Latest Assessment Attempts
CREATE OR REPLACE VIEW student_module_summary AS
SELECT 
    a.user_id,
    ass.module_id,
    MAX(a.score_pct) AS best_score_pct,
    BOOL_OR(a.is_passed) AS module_cleared,
    COUNT(a.id) AS total_attempts,
    (
        SELECT score_pct 
        FROM attempts a2 
        WHERE a2.user_id = a.user_id AND a2.assessment_id = a.assessment_id 
        ORDER BY a2.completed_at DESC 
        LIMIT 1
    ) AS latest_score_pct
FROM attempts a
JOIN assessments ass ON a.assessment_id = ass.id
GROUP BY a.user_id, ass.module_id, a.assessment_id;

-- ============================================================================
-- 6. Clinical Missions & Scoring Verification
-- ============================================================================

CREATE TABLE mission_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    mission_id VARCHAR(100) NOT NULL,
    score INT NOT NULL CHECK (score >= 0 AND score <= 100),
    stars INT NOT NULL CHECK (stars >= 0 AND stars <= 3),
    metrics_json JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_mission_attempts_user ON mission_attempts(user_id, mission_id);

-- ============================================================================
-- 7. Coding Exercises & Student Progress
-- ============================================================================

CREATE TABLE coding_exercises (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    co_tag VARCHAR(10) NOT NULL,
    problem_statement TEXT NOT NULL,
    starter_code TEXT NOT NULL,
    test_cases_json JSONB NOT NULL,
    solution_code TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE user_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    time_spent_seconds INT NOT NULL DEFAULT 0,
    last_accessed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_user_topic UNIQUE (user_id, topic_id)
);

CREATE TABLE ai_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    prompt TEXT NOT NULL,
    response TEXT NOT NULL,
    citations_json JSONB NOT NULL DEFAULT '[]'::jsonb,
    referenced_diagram_node VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ai_conversations_user ON ai_conversations(user_id);
```

---

## 5. Row-Level Security (RLS) Policies

All tables in the hosted database enforce RLS:
1. `users`: Admins can read/write all records. Faculty can view student profiles. Students can read only their own profile.
2. `visual_assets`: Students can SELECT records where `status = 'approved'`. Faculty and Admins can SELECT/INSERT/UPDATE all.
3. `question_bank`: Students have zero direct access to `question_bank` or `correct_answer_json`. Quizzes are served exclusively via sanitized backend RPC/API endpoints with answer keys stripped.
4. `attempts`: Students can SELECT only their own attempts. Faculty and Admins can view all class attempts.
5. `mission_attempts`: Students can query their own best scores and view the anonymized leaderboard.
