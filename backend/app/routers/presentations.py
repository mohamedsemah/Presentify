from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict, Optional
from pydantic import BaseModel

from ..database import get_db
from ..models import Presentation, Slide, ContentBlock
from ..services.presentation_service import PresentationService

router = APIRouter()


class PresentationCreate(BaseModel):
    title: str
    description: Optional[str] = ""
    theme: Optional[str] = "default"
    settings: Optional[Dict] = {}
    slides: Optional[List[Dict]] = []


class PresentationUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    theme: Optional[str] = None
    settings: Optional[Dict] = None


@router.post("/")
async def create_presentation(
        presentation: PresentationCreate,
        db: Session = Depends(get_db)
):
    """Create a new presentation"""
    try:
        new_presentation = PresentationService.create_presentation(
            db, presentation.dict()
        )
        return {"id": new_presentation.id, "message": "Presentation created successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/")
async def get_presentations(db: Session = Depends(get_db)):
    """Get all presentations"""
    presentations = db.query(Presentation).all()
    return [
        {
            "id": p.id,
            "title": p.title,
            "description": p.description,
            "theme": p.theme,
            "created_at": p.created_at,
            "updated_at": p.updated_at,
            "slide_count": len(p.slides)
        }
        for p in presentations
    ]


@router.get("/{presentation_id}")
async def get_presentation(presentation_id: int, db: Session = Depends(get_db)):
    """Get a specific presentation with all slides and content"""
    presentation = PresentationService.get_presentation_with_slides(db, presentation_id)
    if not presentation:
        raise HTTPException(status_code=404, detail="Presentation not found")
    return presentation


@router.put("/{presentation_id}")
async def update_presentation(
        presentation_id: int,
        presentation_update: PresentationUpdate,
        db: Session = Depends(get_db)
):
    """Update a presentation"""
    presentation = db.query(Presentation).filter(Presentation.id == presentation_id).first()
    if not presentation:
        raise HTTPException(status_code=404, detail="Presentation not found")

    update_data = presentation_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(presentation, field, value)

    db.commit()
    return {"message": "Presentation updated successfully"}


@router.delete("/{presentation_id}")
async def delete_presentation(presentation_id: int, db: Session = Depends(get_db)):
    """Delete a presentation"""
    presentation = db.query(Presentation).filter(Presentation.id == presentation_id).first()
    if not presentation:
        raise HTTPException(status_code=404, detail="Presentation not found")

    db.delete(presentation)
    db.commit()
    return {"message": "Presentation deleted successfully"}