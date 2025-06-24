from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
import os

from ..database import get_db
from ..models import Media
from ..services.media_service import MediaService
from ..config import settings

router = APIRouter()


@router.post("/upload")
async def upload_media(
        file: UploadFile = File(...),
        db: Session = Depends(get_db)
):
    """Upload media file"""
    # Validate file size
    if file.size > settings.max_file_size:
        raise HTTPException(status_code=413, detail="File too large")

    # Validate file extension
    file_extension = os.path.splitext(file.filename)[1].lower()
    if file_extension not in settings.allowed_extensions:
        raise HTTPException(status_code=400, detail="File type not allowed")

    try:
        # Read file content
        file_content = await file.read()

        # Save file
        file_metadata = await MediaService.save_uploaded_file(
            file_content, file.filename, file.content_type
        )

        # Optimize image if applicable
        if file.content_type.startswith('image/'):
            optimized_path = MediaService.optimize_image(file_metadata['file_path'])
            if optimized_path != file_metadata['file_path']:
                file_metadata['optimized_path'] = optimized_path

        # Save to database
        media = Media(**file_metadata)
        db.add(media)
        db.commit()
        db.refresh(media)

        return {
            "id": media.id,
            "filename": media.filename,
            "original_filename": media.original_filename,
            "file_path": f"/uploads/{media.filename}",
            "file_size": media.file_size,
            "mime_type": media.mime_type,
            "width": media.width,
            "height": media.height
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")


@router.get("/")
async def get_media(db: Session = Depends(get_db)):
    """Get all uploaded media"""
    media_files = db.query(Media).all()
    return [
        {
            "id": m.id,
            "filename": m.filename,
            "original_filename": m.original_filename,
            "file_path": f"/uploads/{m.filename}",
            "file_size": m.file_size,
            "mime_type": m.mime_type,
            "width": m.width,
            "height": m.height,
            "uploaded_at": m.uploaded_at
        }
        for m in media_files
    ]


@router.delete("/{media_id}")
async def delete_media(media_id: int, db: Session = Depends(get_db)):
    """Delete media file"""
    media = db.query(Media).filter(Media.id == media_id).first()
    if not media:
        raise HTTPException(status_code=404, detail="Media not found")

    # Delete file from disk
    try:
        if os.path.exists(media.file_path):
            os.remove(media.file_path)
    except:
        pass

    # Delete from database
    db.delete(media)
    db.commit()

    return {"message": "Media deleted successfully"}