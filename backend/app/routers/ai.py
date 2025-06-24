from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict
from ..services.ai_service import AIService

router = APIRouter()

class GeneratePresentationRequest(BaseModel):
    prompt: str
    num_slides: Optional[int] = 5
    theme: Optional[str] = "default"

class EnhanceContentRequest(BaseModel):
    content: str
    enhancement_type: Optional[str] = "improve"  # improve, summarize, expand, simplify

@router.post("/generate-presentation")
async def generate_presentation(request: GeneratePresentationRequest):
    """Generate a presentation using AI"""
    try:
        result = await AIService.generate_presentation(
            request.prompt,
            request.num_slides
        )
        result["theme"] = request.theme
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/enhance-content")
async def enhance_content(request: EnhanceContentRequest):
    """Enhance existing content using AI"""
    try:
        enhanced_content = await AIService.enhance_content(
            request.content,
            request.enhancement_type
        )
        return {"enhanced_content": enhanced_content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/suggest-images")
async def suggest_images(prompt: str):
    """Suggest image prompts for content"""
    try:
        # This would integrate with DALL-E or similar service
        suggestions = [
            f"Educational illustration for {prompt}",
            f"Infographic about {prompt}",
            f"Diagram explaining {prompt}",
            f"Visual representation of {prompt}"
        ]
        return {"image_suggestions": suggestions}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
