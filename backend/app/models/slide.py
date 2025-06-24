from sqlalchemy import Column, Integer, String, Text, JSON, ForeignKey
from sqlalchemy.orm import relationship
from ..database import Base


class Slide(Base):
    __tablename__ = "slides"

    id = Column(Integer, primary_key=True, index=True)
    presentation_id = Column(Integer, ForeignKey("presentations.id"), nullable=False)
    order_index = Column(Integer, nullable=False)
    title = Column(String(255))
    layout = Column(String(50), default="default")
    background = Column(JSON, default={})
    animations = Column(JSON, default={})

    # Relationships
    presentation = relationship("Presentation", back_populates="slides")
    content_blocks = relationship("ContentBlock", back_populates="slide", cascade="all, delete-orphan")