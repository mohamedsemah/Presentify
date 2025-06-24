from sqlalchemy import Column, Integer, String, Text, JSON, ForeignKey, Float
from sqlalchemy.orm import relationship
from ..database import Base


class ContentBlock(Base):
    __tablename__ = "content_blocks"

    id = Column(Integer, primary_key=True, index=True)
    slide_id = Column(Integer, ForeignKey("slides.id"), nullable=False)
    type = Column(String(50), nullable=False)  # text, image, video, etc.
    content = Column(Text)
    metadata = Column(JSON, default={})
    position_x = Column(Float, default=0)
    position_y = Column(Float, default=0)
    width = Column(Float, default=100)
    height = Column(Float, default=100)
    z_index = Column(Integer, default=0)
    styles = Column(JSON, default={})

    # Relationships
    slide = relationship("Slide", back_populates="content_blocks")