import openai
from typing import Dict, List, Optional
from ..config import settings

openai.api_key = settings.openai_api_key


class AIService:
    @staticmethod
    async def generate_presentation(prompt: str, num_slides: int = 5) -> Dict:
        """Generate a complete presentation from a prompt"""
        system_message = """You are an expert educational content creator. Generate structured presentation content in JSON format.
        Return a JSON object with:
        - title: presentation title
        - description: brief description
        - slides: array of slide objects with title, content, and layout suggestions

        Each slide should have:
        - title: slide title
        - content: main content (can be bullet points, paragraphs, or structured text)
        - layout: suggested layout (title-content, two-column, image-text, etc.)
        - speaking_notes: optional presenter notes
        """

        user_message = f"Create a {num_slides}-slide educational presentation about: {prompt}"

        try:
            response = await openai.ChatCompletion.acreate(
                model=settings.default_model,
                messages=[
                    {"role": "system", "content": system_message},
                    {"role": "user", "content": user_message}
                ],
                max_tokens=settings.max_tokens,
                temperature=settings.temperature
            )

            import json
            content = response.choices[0].message.content
            return json.loads(content)
        except Exception as e:
            raise Exception(f"AI generation failed: {str(e)}")

    @staticmethod
    async def enhance_content(content: str, enhancement_type: str = "improve") -> str:
        """Enhance existing content"""
        prompts = {
            "improve": "Improve and enhance this educational content while maintaining its core message:",
            "summarize": "Summarize this content into key points:",
            "expand": "Expand this content with more details and examples:",
            "simplify": "Simplify this content for easier understanding:"
        }

        try:
            response = await openai.ChatCompletion.acreate(
                model=settings.default_model,
                messages=[
                    {"role": "user", "content": f"{prompts[enhancement_type]} {content}"}
                ],
                max_tokens=settings.max_tokens,
                temperature=settings.temperature
            )

            return response.choices[0].message.content
        except Exception as e:
            raise Exception(f"Content enhancement failed: {str(e)}")