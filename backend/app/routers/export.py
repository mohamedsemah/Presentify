from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional

from ..database import get_db
from ..services.export_service import ExportService
from ..services.presentation_service import PresentationService

router = APIRouter()


class ExportRequest(BaseModel):
    presentation_id: int
    format: str  # pdf, pptx, html
    options: Optional[dict] = {}


@router.post("/pdf/{presentation_id}")
async def export_pdf(presentation_id: int, db: Session = Depends(get_db)):
    """Export presentation to PDF"""
    presentation = PresentationService.get_presentation_with_slides(db, presentation_id)
    if not presentation:
        raise HTTPException(status_code=404, detail="Presentation not found")

    try:
        pdf_bytes = ExportService.export_to_pdf(presentation)
        filename = f"{presentation['title'].replace(' ', '_')}.pdf"

        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF export failed: {str(e)}")


@router.post("/pptx/{presentation_id}")
async def export_pptx(presentation_id: int, db: Session = Depends(get_db)):
    """Export presentation to PowerPoint"""
    presentation = PresentationService.get_presentation_with_slides(db, presentation_id)
    if not presentation:
        raise HTTPException(status_code=404, detail="Presentation not found")

    try:
        pptx_bytes = ExportService.export_to_pptx(presentation)
        filename = f"{presentation['title'].replace(' ', '_')}.pptx"

        return Response(
            content=pptx_bytes,
            media_type="application/vnd.openxmlformats-officedocument.presentationml.presentation",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PPTX export failed: {str(e)}")


@router.get("/preview/{presentation_id}")
async def export_preview(presentation_id: int, db: Session = Depends(get_db)):
    """Generate a web preview of the presentation"""
    presentation = PresentationService.get_presentation_with_slides(db, presentation_id)
    if not presentation:
        raise HTTPException(status_code=404, detail="Presentation not found")

    # Generate HTML preview
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <title>{presentation['title']}</title>
        <style>
            body {{ font-family: Arial, sans-serif; margin: 0; padding: 20px; }}
            .slide {{ margin-bottom: 40px; border: 1px solid #ddd; padding: 20px; }}
            .slide-title {{ font-size: 24px; font-weight: bold; margin-bottom: 15px; }}
            .content-block {{ margin-bottom: 15px; }}
            .text-block {{ font-size: 16px; line-height: 1.6; }}
            .image-block {{ max-width: 100%; height: auto; }}
        </style>
    </head>
    <body>
        <h1>{presentation['title']}</h1>
        <p>{presentation.get('description', '')}</p>
    """

    for i, slide in enumerate(presentation['slides'], 1):
        html_content += f"""
        <div class="slide">
            <div class="slide-title">Slide {i}: {slide.get('title', 'Untitled')}</div>
        """

        for block in slide.get('content_blocks', []):
            if block['type'] == 'text':
                html_content += f'<div class="content-block text-block">{block["content"]}</div>'
            elif block['type'] == 'image':
                html_content += f'<div class="content-block"><img class="image-block" src="{block.get("file_path", "")}" alt="Image"></div>'

        html_content += "</div>"

    html_content += "</body></html>"

    return Response(content=html_content, media_type="text/html")
