# API Architecture & Endpoint Specification

**Project:** Medical Text and Image Processing Learning Platform (AIDS 12605.1)  
**Institution:** Faculty of Engineering and Technology, Adani Institute of Higher Education and Research (Deemed to be University)  
**Base URL:** `/api/v1`  
**Authentication:** Firebase Bearer ID Token (`Authorization: Bearer <firebase_id_token>`)  
**Format:** RESTful JSON  
**Status:** Approved for Implementation  

---

## 1. Authentication & Security Middleware

Every protected API endpoint requires an `Authorization: Bearer <token>` header containing a valid Firebase ID Token.
The backend authentication middleware executes the following sequence:
1. Verifies the cryptographic signature and expiration of the token with the Firebase Admin SDK.
2. Extracts `uid` and custom claims (`role`).
3. Queries the hosted database where `firebase_uid = uid`.
4. Asserts that `status == 'active'` (or `pending_first_login`). If the user is missing from the database or deactivated, the request is rejected with `403 Forbidden`.
5. Enforces Role-Based Access Control (RBAC): `student`, `faculty`, or `admin`.

### 1.1 Rate Limiting (Upstash Redis)
- **Standard Endpoints:** 60 requests per minute per IP/User.
- **AI Tutor Chat (`/tutor/chat`):** 5 requests per minute per user (conserves free-tier quota).
- **Assessment Submissions:** 10 requests per minute per user.
- **Admin Roster Bulk Upload:** 5 requests per minute per admin.

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
    "email": "student@adani.edu.in",
    "full_name": "Aarav Shah",
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
  "email": "faculty.patel@adani.edu.in",
  "full_name": "Dr. S. Patel",
  "role": "faculty"
}
```
- **Response `201 Created`:**
```json
{
  "status": "success",
  "message": "User provisioned and invitation email sent.",
  "user_id": "9c1e40b7-38f2-49cf-b5eb-a33f44391e45",
  "setup_link": "https://..."
}
```

---

### 2.2 Redis-Backed Admin Roster (`/api/v1/admin/roster`)

The administrative roster is backed by Upstash Redis (`roster_redis_service.py`), providing immediate, persistent active access with automatic duplicate prevention.

#### `GET /api/v1/admin/roster`
Retrieves the complete institutional roster and rolling audit trail from Redis.
- **Access:** `admin`

#### `POST /api/v1/admin/roster`
Adds a single user directly with active access.
- **Request Body:**
```json
{
  "email": "student.mehta@adani.edu.in",
  "full_name": "Riya Mehta",
  "role": "student",
  "temporary_password": "Feat@123",
  "actor_email": "jthakre62@gmail.com"
}
```

#### `POST /api/v1/admin/roster/bulk`
Bulk provisions users from parsed laptop CSV data with automatic email deduplication.
- **Request Body:**
```json
{
  "users": [
    {"email": "student1@adani.edu.in", "full_name": "Student One", "role": "student", "temporary_password": "Feat@123"},
    {"email": "student2@adani.edu.in", "full_name": "Student Two", "role": "student", "temporary_password": "Feat@123"}
  ],
  "actor_email": "jthakre62@gmail.com"
}
```
- **Response `200 OK`:**
```json
{
  "message": "Bulk import completed: added 72 new active users, skipped 3 duplicates",
  "added_count": 72,
  "skipped_count": 3,
  "skipped_emails": ["existing@adani.edu.in"]
}
```

#### `PATCH /api/v1/admin/roster/{user_id}/role`
Updates user institutional role (`student`, `faculty`, `admin`). Root admin is protected from demotion.

#### `POST /api/v1/admin/roster/{user_id}/reset-password`
Resets password back to standard institutional default (`Feat@123`) and dispatches a reset link to the user's inbox.

#### `POST /api/v1/admin/roster/change-password`
Allows the user to set their personal private password, which synchronizes directly with Firebase Auth.

#### `DELETE /api/v1/admin/roster/{user_id}`
Permanently deletes a student or faculty account from Redis and Firebase Auth. Root admin cannot be deleted.

---

### 2.3 Curriculum & Interactive Topic Engine

#### `GET /api/v1/course/modules`
Returns all 6 course modules, descriptions, total theory hours, and CO mappings.
- **Access:** `student`, `faculty`, `admin`

#### `GET /api/v1/course/topics/{slug}`
Retrieves complete topic data for the synchronized dual-panel viewer, including structured sections, linked diagrams, and approved visual assets.
- **Access:** `student`, `faculty`, `admin`

#### `POST /api/v1/course/topics/{id}/progress`
Updates student reading progress and time spent in PostgreSQL and Upstash Redis.

#### `GET /api/v1/curriculum/overview`
Returns the complete 45-hour curriculum hierarchy including 144 slide units and learning outcomes.

---

### 2.4 Assessments, Grading & The >75% Pass Rule

#### `GET /api/v1/assessments/module/{moduleId}/quiz`
Fetches a randomized 15-question quiz instance from the approved question bank. Correct answers and explanations are stripped to prevent cheating.
- **Access:** `student`

#### `POST /api/v1/assessments/{assessmentId}/submit`
Submits quiz responses. The server grades the submission against the secure database answer key, evaluates the >75.0% threshold, and updates student records.
- **Access:** `student`
- **Request Body:**
```json
{
  "answers": [
    {"question_id": "q101", "selected_option": "A"},
    {"question_id": "q102", "short_answer_text": "Linear attenuation coefficient determines beam absorption"}
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
  "latest_score_pct": 86.67
}
```

#### `GET /api/v1/assessments/summary`
Returns student dashboard module summary with best score, latest attempt score, and pass status.

---

### 2.5 Clinical Diagnostic Missions (`/api/v1/missions`)

#### `GET /api/v1/missions`
Returns active clinical mission definitions (Calvarial Fracture, Subdural Hematoma, Pulmonary Bullae, Otsu Glioblastoma, Moiré Suppression).

#### `POST /api/v1/missions/submit`
Validates client-submitted mission parameters against physiological targets on the server:
- **Request Body:**
```json
{
  "mission_id": "calvarial-fracture",
  "window_level": 400,
  "window_width": 1500,
  "hints_used": 1
}
```
- **Response `200 OK`:**
```json
{
  "verified_score": 95,
  "stars": 3,
  "passed": true,
  "feedback": "Optimal bone window achieved. Cortical fracture clearly delineated."
}
```

#### `GET /api/v1/missions/leaderboard`
Returns anonymized class leaderboard with privacy-preserving student aliases (e.g. `Roentgen-07`, `Curie-42`).

---

### 2.6 Grounded AI Clinical Tutor (`/api/v1/tutor`)

#### `POST /api/v1/tutor/chat`
RAG-grounded tutor assistant. Generates responses using Gemini 1.5 Flash grounded strictly on retrieved course topic embeddings.
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
  "response": "Bone appears bright white because of its high linear attenuation coefficient ($\\mu$) relative to soft tissue and water. In standard CT Hounsfield Units, dense cortical bone ranges from +1000 to +3000 HU, mapping to the upper display range.",
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

### 2.7 Faculty Operations & Visual Asset Approval

#### `POST /api/v1/faculty/visuals/generate`
Drafts a visual asset (SVG / illustration prompt).

#### `PATCH /api/v1/faculty/visuals/{id}/approval`
Approves or rejects a draft visual asset. Only approved assets are visible to students.

#### `GET /api/v1/faculty/analytics/class-summary`
Aggregates student pass rates, attempt counts, and question difficulty indexes.

---

### 2.8 System Health & Heartbeat

#### `GET /health` and `GET /api/v1/health`
System health check endpoint verifying microservice status and institution metadata:
```json
{
  "status": "healthy",
  "service": "medical-image-learning-platform-backend",
  "environment": "production",
  "database_target": "hosted_postgresql",
  "institution": "Adani Institute of Higher Education and Research"
}
```
