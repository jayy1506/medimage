-- ============================================================================
-- Migration: 001_initial_schema.sql
-- Project: Medical Text and Image Processing (AIDS 12605.1)
-- Institution: Faculty of Engineering and Technology, Adani Institute of Higher Education and Research
-- Engine: PostgreSQL 15+ with pgvector
-- Single Source of Truth - ZERO LOCAL STORAGE
-- ============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- 2. Enumerations
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('student', 'faculty', 'admin');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE user_status AS ENUM ('active', 'disabled', 'pending_first_login');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE question_type AS ENUM ('mcq', 'short_answer', 'coding');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE difficulty_level AS ENUM ('easy', 'medium', 'hard');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE asset_status AS ENUM ('draft', 'approved', 'rejected');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE diagram_type AS ENUM ('mermaid', 'svg', 'interactive_sim');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 3. Users Table (Mirrors Firebase Auth UIDs with Custom Claims)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    firebase_uid VARCHAR(128) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'student',
    status user_status NOT NULL DEFAULT 'pending_first_login',
    force_password_change BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_firebase_uid ON users(firebase_uid);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);

-- 4. Audit Logs (Mandatory for Admin Actions & Compliance)
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    target_type VARCHAR(50) NOT NULL,
    target_id VARCHAR(100) NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    ip_address VARCHAR(45),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON audit_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- 5. Course Modules (Modules 1 to 6)
CREATE TABLE IF NOT EXISTS modules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    module_number INT UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    theory_hours INT NOT NULL DEFAULT 8,
    co_tags TEXT[] NOT NULL DEFAULT '{}',
    order_index INT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Topics
CREATE TABLE IF NOT EXISTS topics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
    slug VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    order_index INT NOT NULL,
    co_tags TEXT[] NOT NULL DEFAULT '{}',
    read_time_minutes INT NOT NULL DEFAULT 15,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_topics_module_id ON topics(module_id);
CREATE INDEX IF NOT EXISTS idx_topics_slug ON topics(slug);

-- 7. Diagrams (Mermaid / SVG / Interactive Workstations)
CREATE TABLE IF NOT EXISTS diagrams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    diagram_type diagram_type NOT NULL,
    code_or_markup TEXT NOT NULL,
    layer_config JSONB DEFAULT '{}'::jsonb,
    interactive_node_map JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Topic Sections (Synchronized with Diagrams in Dual-Panel Layout)
CREATE TABLE IF NOT EXISTS topic_sections (
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

CREATE INDEX IF NOT EXISTS idx_topic_sections_topic_id ON topic_sections(topic_id);

-- 9. Visual Assets (Faculty Approval Workflow)
CREATE TABLE IF NOT EXISTS visual_assets (
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
    status asset_status NOT NULL DEFAULT 'draft',
    approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
    approved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_visual_assets_status ON visual_assets(status);
CREATE INDEX IF NOT EXISTS idx_visual_assets_topic ON visual_assets(topic_id);

-- 10. Topic Embeddings (MiniLM-L6-v2 384-dimensional vector store for RAG)
CREATE TABLE IF NOT EXISTS topic_embeddings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    section_id UUID REFERENCES topic_sections(id) ON DELETE CASCADE,
    chunk_text TEXT NOT NULL,
    embedding VECTOR(384) NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. Question Bank
CREATE TABLE IF NOT EXISTS question_bank (
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

CREATE INDEX IF NOT EXISTS idx_question_bank_module ON question_bank(module_id);
CREATE INDEX IF NOT EXISTS idx_question_bank_type ON question_bank(question_type);

-- 12. Assessments & Attempts (>75% Pass Rule)
CREATE TABLE IF NOT EXISTS assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    pass_threshold_pct NUMERIC(5, 2) NOT NULL DEFAULT 75.00,
    time_limit_minutes INT NOT NULL DEFAULT 30,
    num_random_questions INT NOT NULL DEFAULT 15,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS attempts (
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

CREATE INDEX IF NOT EXISTS idx_attempts_user_assessment ON attempts(user_id, assessment_id);
CREATE INDEX IF NOT EXISTS idx_attempts_score ON attempts(score_pct);

-- 13. Student Progress & AI Conversations
CREATE TABLE IF NOT EXISTS user_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    time_spent_seconds INT NOT NULL DEFAULT 0,
    last_accessed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_user_topic UNIQUE (user_id, topic_id)
);

CREATE TABLE IF NOT EXISTS ai_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    prompt TEXT NOT NULL,
    response TEXT NOT NULL,
    citations_json JSONB NOT NULL DEFAULT '[]'::jsonb,
    referenced_diagram_node VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 14. Student Assessment Summary View (Tracks Best and Latest Attempt)
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
