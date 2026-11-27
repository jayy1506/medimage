# Testing & Quality Assurance Specification

**Project:** Medical Text and Image Processing Learning Platform (AIDS 12605.1)  
**Institution:** Faculty of Engineering and Technology, Adani Institute of Higher Education and Research (Deemed to be University)  
**Methodology:** Ralph Loop (Implement -> Run Tests -> Read Errors -> Fix -> Pass)  
**Target Coverage:** Backend $\ge 85\%$, Frontend Core $\ge 80\%$, Lexi Eval Suite $100\%$ (40/40)  
**Status:** Approved for Implementation  

---

## 1. Testing Pyramid & Tooling

```mermaid
graph TD
    subgraph Test Layers
        E2E[End-to-End Testing\nPlaywright Browser Automation]
        Integration[Integration & API Testing\nPytest + HTTPX + Supabase DB]
        Unit[Unit Testing\nVitest & Pytest]
        AI_Eval[Lexi Automated Evaluation Suite\n40 Test Cases Across 5 Categories]
        Load[Concurrency & Load Testing\nLocust / Python Runner - 200+ Students]
    end
```

| Layer | Framework | Scope & Focus | Execution Command |
| :--- | :--- | :--- | :--- |
| **Backend Unit & Integration** | `pytest` + `pytest-asyncio` | Auth verification, RBAC permissions, question randomizer, >75% pass rule, audit logging. | `cd backend && pytest tests/ -v` |
| **Frontend Unit & Components** | `vitest` / Jest | Curriculum data validation, slide unit formatting, KaTeX equation integrity. | `cd frontend && npm run test` |
| **Lexi AI Guide Evaluation** | TypeScript Eval Suite | Fast Scope Gate accuracy, prompt injection trapping, citation verification across 40 test cases. | `cd frontend && npx ts-node src/eval/project-eval.ts` |
| **End-to-End (E2E)** | `playwright` | Full user journey: Admin user invite -> Student login -> Topic dual-panel study -> Quiz completion -> Pass rule validation. | `npx playwright test` |
| **Concurrency Load Test** | Python / k6 | 200 virtual students concurrently viewing topics, running client demos, and submitting quizzes. | `python scripts/load_test_200_users.py` |

---

## 2. Core Test Suites

### 2.1 Backend RBAC & Pass Rule Tests (`backend/tests/test_assessments.py`)
```python
import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_pass_rule_strict_threshold(client: AsyncClient, student_token: str):
    """Verifies that a score of 75.0% fails, while 75.1% passes."""
    # Submission resulting in 75.00%
    res_fail = await client.post(
        "/api/v1/assessments/test-assessment-id/submit",
        headers={"Authorization": f"Bearer {student_token}"},
        json={"score_override_for_test": 75.00}
    )
    assert res_fail.status_code == 200
    assert res_fail.json()["is_passed"] is False

    # Submission resulting in 75.10%
    res_pass = await client.post(
        "/api/v1/assessments/test-assessment-id/submit",
        headers={"Authorization": f"Bearer {student_token}"},
        json={"score_override_for_test": 75.10}
    )
    assert res_pass.status_code == 200
    assert res_pass.json()["is_passed"] is True
```

### 2.2 Security & Invite-Only Lockdown Tests (`backend/tests/test_auth.py`)
```python
@pytest.mark.asyncio
async def test_unregistered_firebase_user_blocked(client: AsyncClient, rogue_firebase_token: str):
    """Proves that a valid Firebase account NOT in the Postgres users table receives 403."""
    res = await client.get(
        "/api/v1/course/modules",
        headers={"Authorization": f"Bearer {rogue_firebase_token}"}
    )
    assert res.status_code == 403
    assert "not authorized" in res.json()["detail"].lower()
```

### 2.3 Lexi AI Guide Automated Evaluation Suite (`frontend/src/eval/project-eval.ts`)
The Lexi evaluation suite tests 40 distinct cases across 5 categories, achieving **100% (40/40)** accuracy:
1. **Curriculum Concept Queries:** Verifies that queries regarding Radon transform, MRI relaxation, and Hounsfield scaling return grounded responses citing exact topics.
2. **Clinical Refusal Check:** Prompts asking for diagnostic interpretation must include the exact refusal substring: *"cannot interpret personal medical images or provide medical/diagnostic advice"*.
3. **Off-Topic Scope Gate:** Queries on non-course subjects (politics, web dev, general trivia) are politely declined.
4. **Prompt Injection Trapping:** Adversarial injection attempts (e.g. "Ignore previous instructions", roleplay bypasses) are blocked with the institutional refusal notice.
5. **Exact Citation Validation:** Academic answers must contain valid `{ file, section }` citations from the `/knowledge/` corpus.

---

## 3. Concurrency Load Test (200+ Active Students)

To prove system stability under lecture conditions (70–200 simultaneous students):
- **Script:** `scripts/load_test_200_users.py` / `scripts/load_test_200_users.js`
- **Scenario:** 200 Virtual Users (VUs) ramp up over 30 seconds, sustained for 5 minutes.
- **User Actions:**
  - 60% browsing interactive topic pages and viewing diagrams (cached).
  - 20% running client-side image processing demos (zero backend load).
  - 15% taking module quizzes.
  - 5% submitting queries to the AI tutor.
- **Pass Criteria:**
  - HTTP 500/502/503 errors: $0.0\%$.
  - 95th percentile response time ($p95$): $< 400$ ms.
  - Supabase pooler connections: Peak $< 40$ connections (well below 60 connection free-tier limit).
  - Upstash Redis commands: $< 2,000$ commands during test run.
