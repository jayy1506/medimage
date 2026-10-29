import uuid
from datetime import datetime
from typing import List, Optional
from sqlalchemy import Column, String, Integer, Text, Boolean, DateTime, ForeignKey, ARRAY
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from app.db.session import Base


class Module(Base):
    __tablename__ = "modules"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    module_number = Column(Integer, unique=True, nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    theory_hours = Column(Integer, default=8, nullable=False)
    co_tags = Column(ARRAY(Text), default=list, nullable=False)
    order_index = Column(Integer, nullable=False)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)

    topics = relationship("Topic", back_populates="module", order_by="Topic.order_index")


class Topic(Base):
    __tablename__ = "topics"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    module_id = Column(UUID(as_uuid=True), ForeignKey("modules.id", ondelete="CASCADE"), nullable=False, index=True)
    slug = Column(String(100), unique=True, nullable=False, index=True)
    title = Column(String(255), nullable=False)
    order_index = Column(Integer, nullable=False)
    co_tags = Column(ARRAY(Text), default=list, nullable=False)
    read_time_minutes = Column(Integer, default=15, nullable=False)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)

    module = relationship("Module", back_populates="topics")
    sections = relationship("TopicSection", back_populates="topic", order_by="TopicSection.order_index")
    diagrams = relationship("Diagram", back_populates="topic")
    visual_assets = relationship("VisualAsset", back_populates="topic")


class Diagram(Base):
    __tablename__ = "diagrams"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    topic_id = Column(UUID(as_uuid=True), ForeignKey("topics.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    diagram_type = Column(String(50), nullable=False)  # 'mermaid', 'svg', 'interactive_sim'
    code_or_markup = Column(Text, nullable=False)
    layer_config = Column(JSONB, default=dict)
    interactive_node_map = Column(JSONB, default=dict)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)

    topic = relationship("Topic", back_populates="diagrams")


class TopicSection(Base):
    __tablename__ = "topic_sections"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    topic_id = Column(UUID(as_uuid=True), ForeignKey("topics.id", ondelete="CASCADE"), nullable=False, index=True)
    section_number = Column(Integer, nullable=False)
    section_type = Column(String(50), nullable=False)  # 'objectives', 'overview', 'detailed_math', 'clinical_relevance', 'summary'
    title = Column(String(255), nullable=False)
    content_markdown = Column(Text, nullable=False)
    formula_latex = Column(Text, nullable=True)
    linked_diagram_id = Column(UUID(as_uuid=True), ForeignKey("diagrams.id", ondelete="SET NULL"), nullable=True)
    order_index = Column(Integer, nullable=False)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)

    topic = relationship("Topic", back_populates="sections")
    linked_diagram = relationship("Diagram")


class VisualAsset(Base):
    __tablename__ = "visual_assets"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    topic_id = Column(UUID(as_uuid=True), ForeignKey("topics.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    asset_type = Column(String(50), nullable=False)
    prompt = Column(Text, nullable=True)
    model_used = Column(String(100), nullable=True)
    storage_url = Column(Text, nullable=False)
    alt_text = Column(Text, nullable=False)
    license = Column(String(100), nullable=False)
    attribution = Column(Text, nullable=True)
    status = Column(String(50), default="draft", nullable=False, index=True)
    approved_by = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    approved_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)

    topic = relationship("Topic", back_populates="visual_assets")


class UserProgress(Base):
    __tablename__ = "user_progress"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    topic_id = Column(UUID(as_uuid=True), ForeignKey("topics.id", ondelete="CASCADE"), nullable=False)
    is_completed = Column(Boolean, default=False, nullable=False)
    time_spent_seconds = Column(Integer, default=0, nullable=False)
    last_accessed_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)
