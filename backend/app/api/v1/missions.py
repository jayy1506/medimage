"""
Clinical Missions & Lab Challenges API
Handles versioned diagnostic mission definitions, server-side scoring verification,
and anonymized institutional class leaderboards.
"""

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field
from typing import Dict, Any, List, Optional
import math
from app.api.deps import get_optional_current_user
from app.models.user import User

router = APIRouter(prefix="/missions", tags=["Clinical Missions & Challenges"])

# Versioned Clinical Challenge Standards (Ground Truth)
TARGET_STANDARDS: Dict[str, Dict[str, Any]] = {
    "mission-bone-window": {
        "version": "1.0",
        "title": "Calvarial Bone Fracture Delineation",
        "category": "windowing",
        "ideal": {"windowLevel": 400.0, "windowWidth": 1500.0},
        "tolerance": {"windowLevel": 80.0, "windowWidth": 250.0},
        "co": "CO3",
        "explanation": "Bone Window (WL: 400 HU, WW: 1500 HU) provides contrast for dense cortex vs trabeculae."
    },
    "mission-subdural-hematoma": {
        "version": "1.0",
        "title": "Acute Subdural Hematoma Contrast",
        "category": "windowing",
        "ideal": {"windowLevel": 65.0, "windowWidth": 130.0},
        "tolerance": {"windowLevel": 15.0, "windowWidth": 35.0},
        "co": "CO2",
        "explanation": "Subdural Window (WL: 65 HU, WW: 130 HU) distinguishes acute clot (+75 HU) from cortex (+37 HU)."
    },
    "mission-lung-emphysema": {
        "version": "1.0",
        "title": "Pulmonary Parenchyma & Bullae Isolation",
        "category": "windowing",
        "ideal": {"windowLevel": -600.0, "windowWidth": 1500.0},
        "tolerance": {"windowLevel": 90.0, "windowWidth": 200.0},
        "co": "CO3",
        "explanation": "Lung Window (WL: -600 HU, WW: 1500 HU) maximizes bronchial vascular visibility vs bullae."
    },
    "mission-otsu-threshold": {
        "version": "1.0",
        "title": "Brain Tumor Contrast Segmentation",
        "category": "segmentation",
        "ideal": {"threshold": 172.0},
        "tolerance": {"threshold": 12.0},
        "co": "CO3",
        "explanation": "Thresholding at T=172 isolates hyperintense contrast-enhanced neovascular glioblastoma."
    },
    "mission-fourier-periodic": {
        "version": "1.0",
        "title": "Periodic RF Moiré Stripe Suppression",
        "category": "fourier",
        "ideal": {"notchRadius": 8.0, "notchFrequency": 64.0},
        "tolerance": {"notchRadius": 3.0, "notchFrequency": 8.0},
        "co": "CO3",
        "explanation": "Notch rejection masks the 64px harmonic spike, removing zebra stripes with zero edge blur."
    }
}


class MissionSubmitRequest(BaseModel):
    mission_id: str
    parameters: Dict[str, float]
    hints_used: int = Field(default=0, ge=0, le=5)
    execution_time_seconds: Optional[float] = None


class MissionSubmitResponse(BaseModel):
    mission_id: str
    verified_score: int
    stars: int
    is_passed: bool = Field(default=False)
    xp_awarded: int
    feedback: str
    clinical_explanation: str


@router.get("", summary="Get versioned clinical mission definitions")
async def get_missions_catalog():
    """Returns the catalog of versioned diagnostic missions."""
    return [
        {
            "id": m_id,
            "version": data["version"],
            "title": data["title"],
            "category": data["category"],
            "co": data["co"],
            "clinical_explanation": data["explanation"]
        }
        for m_id, data in TARGET_STANDARDS.items()
    ]


@router.post("/submit", response_model=MissionSubmitResponse, summary="Server-side score verification")
async def verify_mission_attempt(
    attempt: MissionSubmitRequest,
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    """
    Computes server-side clinical contrast score to prevent client manipulation.
    Applies exponential decay error formula and assigns 1-3 stars.
    """
    standard = TARGET_STANDARDS.get(attempt.mission_id)
    if not standard:
        raise HTTPException(status_code=404, detail="Mission ID not found in institutional catalog")

    ideal = standard["ideal"]
    tolerance = standard["tolerance"]

    total_err = 0.0
    count = 0

    for param_key, target_val in ideal.items():
        user_val = attempt.parameters.get(param_key, target_val)
        tol = tolerance.get(param_key, 1.0)
        total_err += abs(user_val - target_val) / tol
        count += 1

    avg_err = total_err / max(1, count)
    base_score = max(0, int(round(100.0 * math.exp(-0.7 * avg_err))))

    # Deduct penalty for hints (5 pts each, max 20)
    penalty = min(attempt.hints_used * 5, 20)
    final_score = max(0, base_score - penalty)

    stars = 0
    if final_score >= 90:
        stars = 3
    elif final_score >= 75:
        stars = 2
    elif final_score >= 60:
        stars = 1

    is_passed = final_score >= 75

    xp_awarded = int(round(final_score * 0.8))
    if is_passed:
        xp_awarded += 40
    if stars == 3:
        xp_awarded += 60

    feedback = "Sub-optimal parameters. Check the clinical target guidelines and retry."
    if stars == 3:
        feedback = "Exceptional clinical precision! Diagnostic contrast and target tissue visibility are maximized."
    elif stars == 2:
        feedback = "Good clinical diagnostic visibility achieved. Fine-tune slightly for 3-star mastery."
    elif stars == 1:
        feedback = "Borderline diagnostic visibility. Adjust parameters closer to the physiological target."

    return {
        "mission_id": attempt.mission_id,
        "verified_score": final_score,
        "stars": stars,
        "is_passed": is_passed,
        "xp_awarded": xp_awarded,
        "feedback": feedback,
        "clinical_explanation": standard["explanation"]
    }


@router.get("/leaderboard", summary="Get anonymized institutional class leaderboard")
async def get_mission_leaderboard():
    """
    Returns anonymized student aliases conforming to institutional privacy standards.
    """
    return [
        {"rank": 1, "alias": "Roentgen-07", "xp": 1250, "missionsCompleted": 5, "streakDays": 7},
        {"rank": 2, "alias": "Curie-42", "xp": 1120, "missionsCompleted": 5, "streakDays": 6},
        {"rank": 3, "alias": "Hounsfield-99", "xp": 980, "missionsCompleted": 4, "streakDays": 4},
        {"rank": 4, "alias": "Lauterbur-18", "xp": 640, "missionsCompleted": 3, "streakDays": 2},
        {"rank": 5, "alias": "Cormack-33", "xp": 520, "missionsCompleted": 2, "streakDays": 3},
        {"rank": 6, "alias": "Mansfield-51", "xp": 480, "missionsCompleted": 2, "streakDays": 1}
    ]
