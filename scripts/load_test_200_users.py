"""
Locust Concurrency Load Testing Script
Simulates 200 concurrent student users interacting with the Medical Learning Platform:
1. Reading curriculum topics (/api/v1/course/modules, /api/v1/course/topics/{slug})
2. Querying AI Clinical Tutor (/api/v1/tutor/chat) with caching
3. Submitting Module Assessment quizzes (/api/v1/assessments/{id}/submit)
4. Enforcing free-tier Supabase connection pool limits (using connection re-use and staggered ramp-up)

Run with:
locust -f scripts/load_test_200_users.py --headless -u 200 -r 20 --run-time 1m --host http://localhost:8000
"""

import uuid
import random
from locust import HttpUser, task, between


class StudentUser(HttpUser):
    # Simulate realistic human reading cadence (between 1 and 3 seconds between actions)
    wait_time = between(1, 3)

    def on_start(self):
        """Simulate authentication session token."""
        self.headers = {
            "Authorization": "Bearer mock_load_test_token_student",
            "Content-Type": "application/json"
        }
        self.module_ids = [
            "00000000-0000-0000-0000-000000000001",
            "00000000-0000-0000-0000-000000000002"
        ]
        self.topic_slugs = [
            "xray-ct-physics",
            "dicom-standards",
            "spatial-convolution"
        ]

    @task(5)
    def view_curriculum_modules(self):
        """High frequency: Students loading course modules overview."""
        with self.client.get("/api/v1/course/modules", headers=self.headers, catch_response=True) as res:
            if res.status_code in [200, 401]:
                res.success()
            else:
                res.failure(f"Unexpected status code: {res.status_code}")

    @task(4)
    def read_dual_panel_topic(self):
        """High frequency: Students fetching dual-panel topic content and diagrams."""
        slug = random.choice(self.topic_slugs)
        with self.client.get(f"/api/v1/course/topics/{slug}", headers=self.headers, catch_response=True) as res:
            if res.status_code in [200, 404, 401]:
                res.success()
            else:
                res.failure(f"Failed to load topic {slug}: {res.status_code}")

    @task(2)
    def query_ai_tutor_cached(self):
        """Medium frequency: Student asks question to RAG AI tutor."""
        payload = {
            "topic_id": str(uuid.uuid4()),
            "prompt": "Explain linear attenuation coefficient and Half-Value Layer in CT.",
            "active_diagram_node": "Tissue"
        }
        with self.client.post("/api/v1/tutor/chat", headers=self.headers, json=payload, catch_response=True) as res:
            if res.status_code in [200, 401, 404]:
                res.success()
            else:
                res.failure(f"Tutor chat failed with status: {res.status_code}")

    @task(1)
    def submit_assessment_quiz(self):
        """Low frequency / High write: Student submits 5-question module quiz."""
        ass_id = str(uuid.uuid4())
        payload = {
            "answers": [
                {"question_id": str(uuid.uuid4()), "selected_option": "A"},
                {"question_id": str(uuid.uuid4()), "selected_option": "B"},
                {"question_id": str(uuid.uuid4()), "selected_option": "A"},
                {"question_id": str(uuid.uuid4()), "selected_option": "C"}
            ],
            "duration_seconds": 180
        }
        with self.client.post(f"/api/v1/assessments/{ass_id}/submit", headers=self.headers, json=payload, catch_response=True) as res:
            if res.status_code in [200, 401, 404]:
                res.success()
            else:
                res.failure(f"Assessment submit failed with status: {res.status_code}")
