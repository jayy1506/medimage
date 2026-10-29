import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from sqlalchemy import Column, String, Integer, Text, Boolean, DateTime, ForeignKey, Numeric
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from app.db.session import Base


class QuestionBank(Base):
    __tablename__ = "question_bank"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    module_id = Column(UUID(as_uuid=True), ForeignKey("modules.id", ondelete="CASCADE"), nullable=False, index=True)
    topic_id = Column(UUID(as_uuid=True), ForeignKey("topics.id", ondelete="SET NULL"), nullable=True)
    co_tag = Column(String(10), nullable=False)
    question_type = Column(String(50), nullable=False)  # 'mcq', 'short_answer', 'coding'
    question_text = Column(Text, nullable=False)
    options_json = Column(JSONB, default=list)  # [{"id": "A", "text": "..."}]
    correct_answer_json = Column(JSONB, nullable=False)  # {"correct_option_id": "A"}
    explanation = Column(Text, nullable=False)
    rubric_json = Column(JSONB, default=dict)
    difficulty = Column(String(20), default="medium", nullable=False)
    is_approved = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)


class Assessment(Base):
    __tablename__ = "assessments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    module_id = Column(UUID(as_uuid=True), ForeignKey("modules.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    pass_threshold_pct = Column(Numeric(5, 2), default=75.00, nullable=False)
    time_limit_minutes = Column(Integer, default=30, nullable=False)
    num_random_questions = Column(Integer, default=15, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)

    attempts = relationship("Attempt", back_populates="assessment")


class Attempt(Base):
    __tablename__ = "attempts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    assessment_id = Column(UUID(as_uuid=True), ForeignKey("assessments.id", ondelete="CASCADE"), nullable=False, index=True)
    attempt_number = Column(Integer, nullable=False)
    score_pct = Column(Numeric(5, 2), nullable=False)
    is_passed = Column(Boolean, nullable=False)
    answers_json = Column(JSONB, nullable=False)
    ai_grading_json = Column(JSONB, default=dict)
    faculty_override_json = Column(JSONB, default=dict)
    started_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)
    completed_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)

    assessment = relationship("Assessment", back_populates="attempts")


class CodingExercise(Base):
    __tablename__ = "coding_exercises"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    topic_id = Column(UUID(as_uuid=True), ForeignKey("topics.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    co_tag = Column(String(10), nullable=False)
    problem_statement = Column(Text, nullable=False)
    starter_code = Column(Text, nullable=False)
    test_cases_json = Column(JSONB, default=list, nullable=False)  # [{"input": "...", "expected": "...", "is_hidden": false}]
    solution_code = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)
