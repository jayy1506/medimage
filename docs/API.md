# API Architecture & Endpoint Specification

**Project:** Medical Text and Image Processing Learning Platform (AIDS 12605.1)  
**Base URL:** `/api/v1`  
**Authentication:** Firebase Bearer ID Token (`Authorization: Bearer <firebase_id_token>`)  
**Format:** RESTful JSON  
**Status:** Approved for Implementation  

---

## 1. Authentication & Security Middleware

Every API endpoint (except health check) requires an `Authorization: Bearer <token>` header containing a valid Firebase ID Token.
The backend authentication middleware performs the following sequence:
1. Verifies the cryptographic signature and expiration of the token with the Firebase Admin SDK.
2. Extracts `uid` and custom claims (`role`).
3. Queries the hosted PostgreSQL `users` table where `firebase_uid = uid`.
4. Asserts that `status == 'active'` (or `pending_first_login` for password-reset paths). If the user is missing from the database or disabled, the request is immediately rejected with `403 Forbidden`.
5. Enforces Role-Based Access Control (RBAC): `student`, `faculty`, or `admin`.

### 1.1 Rate Limiting (Upstash Redis)
- **Standard Endpoints:** 60 requests per minute per IP/User.
- **AI Tutor Chat (`/tutor/chat`):** 5 requests per minute per user (enforces free-tier conservation).
- **Assessment Submissions:** 10 requests per minute per user.
- **Admin Bulk CSV Upload:** 2 requests per minute per admin.

---

## 2. API Endpoints Catalog

### 2.1 Identity, Session & Admin Management

#### `POST /api/v1/auth/session`
Validates Firebase token, synchronizes last login, and returns current user profile and role.
- **Access:** Authenticated
- **Response `200 OK`:**
```json
{
  "user": {
    "id": "c8b417ef-7b89-4a9f-96a4-c5a4d3bf2f28",
    "firebase_uid": "abc123firebaseUid",
    "email": "student@dmiher.edu.in",
    "full_name": "Aarav Sharma",
    "role": "student",
    "status": "active",
    "force_password_change": false
  }
}
```

#### `POST /api/v1/admin/users`
Creates a single student or faculty account. Generates a password setup link via Firebase Admin SDK.
- **Access:** `admin` only
- **Request Body:**
```json
{
  "email": "faculty.patil@dmiher.edu.in",
  "full_name": "Dr. S. Patil",
  "role": "faculty"
}
```
- **Response `201 Created`:**
```json
{
  "status": "success",
  "message": "User provisioned and invitation email sent.",
  "user_id": "9c1e40b7-38f2-49cf-b5eb-a33f44391e45"
}
```

#### `POST /api/v1/admin/users/bulk`
Bulk import users via CSV payload.
- **Access:** `admin` only
- **Request:** `multipart/form-data` with `file: students.csv` (Columns: `email,full_name,role`).
- **Response `200 OK`:**
```json
{
  "total_records": 72,
  "successful_invites": 72,
  "failed_invites": 0,
  "errors": []
}
```

#### `GET /api/v1/admin/audit-logs`
Retrieves paginated platform audit logs.
- **Access:** `admin` only
- **Query Params:** `?page=1&limit=20&action=CREATE_USER`
- **Response `200 OK`:**
```json
{
  "page": 1,
  "total_logs": 145,
  "logs": [
    {
      "id": "784d1421-df59-4d92-bb8a-1ec1bb6e1189",
      "actor_name": "System Administrator",
      "action": "BULK_IMPORT_STUDENTS",
      "target_type": "USER_BATCH",
      "target_id": "72_records",
      "created_at": "2026-10-29T14:00:00Z"
    }
  ]
}
```

---

### 2.2 Curriculum & Interactive Topic Engine

#### `GET /api/v1/course/modules`
Returns all 6 course modules, descriptions, total theory hours, and CO mappings.
- **Access:** `student`, `faculty`, `admin`
- **Response `200 OK`:**
```json
[
  {
    "id": "e305e523-281b-4f7f-8d26-72fc7f938b81",
    "module_number": 1,
    "title": "Medical Image Sources",
    "theory_hours": 8,
    "co_tags": ["CO1"],
    "topics_count": 6
  }
]
```

#### `GET /api/v1/course/topics/{slug}`
Retrieves complete topic data for the synchronized dual-panel viewer, including structured sections, linked diagrams, and approved visual assets.
- **Access:** `student`, `faculty`, `admin`
- **Response `200 OK`:**
```json
{
  "id": "f51a441e-5437-43f1-b8f2-1d5ce1a2bf24",
  "module_number": 1,
  "slug": "xray-physics-attenuation",
  "title": "Basic X-ray Physics and Attenuation",
  "co_tags": ["CO1"],
  "read_time_minutes": 18,
  "sections": [
    {
      "section_number": 1,
      "section_type": "overview",
      "title": "Photon Attenuation Principles",
      "content_markdown": "Linear attenuation coefficient $\\mu$ governs photon beam transmission...",
      "formula_latex": "I(x) = I_0 e^{-\\mu x}",
      "linked_diagram_id": "d09418a2-a89c-48be-9dc1-2dfc39a3c861"
    }
  ],
  "diagrams": [
    {
      "id": "d09418a2-a89c-48be-9dc1-2dfc39a3c861",
      "title": "Exponential Attenuation & Beam Hardening",
      "diagram_type": "mermaid",
      "code_or_markup": "graph LR\n  XRayTube[X-ray Tube] --> Filter[Al Filter]\n  Filter --> Tissue[Patient Tissue \\mu]\n  Tissue --> Detector[Flat Panel Detector]",
      "interactive_node_map": {
        "Tissue": "Linear attenuation coefficient determines contrast in soft tissue vs bone."
      }
    }
  ],
  "approved_visuals": [
    {
      "id": "119f80a4-25e4-4d1e-841f-82bbcfd02919",
      "title": "Chest Radiograph Attenuation Map",
      "storage_url": "https://[supabase-project].supabase.co/storage/v1/object/public/assets/xray-attenuation-scan.webp",
      "alt_text": "PA Chest Radiograph demonstrating high attenuation in ribs and low attenuation in lung parenchyma",
      "license": "CC BY 4.0",
      "attribution": "NIH Clinical Center Open ChestX-ray14"
    }
  ]
}
```

#### `POST /api/v1/course/topics/{id}/progress`
Updates student reading progress and time spent.
- **Access:** `student`
- **Request Body:**
```json
{
  "is_completed": true,
  "time_spent_seconds": 720
}
```

---

### 2.3 Assessments, Grading & The >75% Pass Rule

#### `GET /api/v1/assessments/module/{moduleId}/quiz`
Fetches a randomized 15-question quiz instance from the approved question bank. Question answers and explanations are stripped to prevent inspection.
- **Access:** `student`
- **Response `200 OK`:**
```json
{
  "assessment_id": "5285747e-8551-4091-8ee2-a1622b7a9117",
  "module_id": "e305e523-281b-4f7f-8d26-72fc7f938b81",
  "pass_threshold_pct": 75.0,
  "time_limit_minutes": 30,
  "questions": [
    {
      "id": "q101",
      "question_type": "mcq",
      "co_tag": "CO1",
      "question_text": "What phenomenon causes beam hardening in polychromatic X-ray sources?",
      "options": [
        {"id": "A", "text": "Preferential absorption of lower energy photons"},
        {"id": "B", "text": "Compton scattering of high energy photons only"},
        {"id": "C", "text": "Pair production in air"},
        {"id": "D", "text": "Detector saturation"}
      ]
    }
  ]
}
```

#### `POST /api/v1/assessments/{assessmentId}/submit`
Submits quiz responses. The server grades the submission against the secure database answer key, evaluates the >75% threshold, and updates student records.
- **Access:** `student`
- **Request Body:**
```json
{
  "answers": [
    {"question_id": "q101", "selected_option": "A"},
    {"question_id": "q102", "short_answer_text": "Hounsfield Unit is defined as 1000 * (mu - mu_water) / mu_water"}
  ]
}
```
- **Response `200 OK`:**
```json
{
  "attempt_id": "119f80a4-25e4-4d1e-841f-82bbcfd02919",
  "score_pct": 86.67,
  "is_passed": true,
  "pass_threshold_pct": 75.0,
  "message": "Congratulations! You cleared this module with above 75%.",
  "best_score_pct": 86.67,
  "latest_score_pct": 86.67,
  "review": [
    {
      "question_id": "q101",
      "is_correct": true,
      "explanation": "Low-energy photons are attenuated more rapidly, shifting the mean energy higher."
    }
  ]
}
```

#### `GET /api/v1/assessments/summary`
Returns student dashboard module summary with best score, latest attempt score, and pass status.
- **Access:** `student`

---

### 2.4 Grounded AI Clinical Tutor

#### `POST /api/v1/tutor/chat`
RAG-grounded tutor assistant. Generates response using Gemini 1.5 Flash grounded strictly on retrieved course topic embeddings.
- **Access:** `student`, `faculty`
- **Request Body:**
```json
{
  "topic_id": "f51a441e-5437-43f1-b8f2-1d5ce1a2bf24",
  "prompt": "Why does bone appear bright white in a standard CT window?",
  "active_diagram_node": "Tissue"
}
```
- **Response `200 OK`:**
```json
{
  "response": "Bone appears bright white because of its high linear attenuation coefficient ($\\mu$) relative to soft tissue and water. In standard CT Hounsfield Units, dense cortical bone ranges from +1000 to +3000 HU, which maps to the upper limits of the gray-level display window.",
  "citations": [
    {
      "topic_title": "Basic X-ray Physics and Attenuation",
      "section_number": 1,
      "reference_code": "AIDS-12605.1-M1-T2"
    }
  ],
  "highlight_diagram_node": "Tissue"
}
```

---

### 2.5 Faculty Operations & Visual Asset Approval

#### `POST /api/v1/faculty/visuals/generate`
Drafts a visual asset (SVG / illustration prompt).
- **Access:** `faculty`, `admin`

#### `PATCH /api/v1/faculty/visuals/{id}/approval`
Approves or rejects a draft visual asset. Only approved assets are returned to students.
- **Access:** `faculty`, `admin`
- **Request Body:**
```json
{
  "status": "approved",
  "editorial_notes": "Verified anatomical accuracy and SVG node labeling."
}
```

#### `GET /api/v1/faculty/analytics/class-summary`
Aggregates student pass rates, attempt counts, and question difficulty indexes.
- **Access:** `faculty`, `admin`
