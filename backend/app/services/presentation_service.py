from sqlalchemy.orm import Session
from typing import List, Dict, Optional
from ..models import Presentation, Slide, ContentBlock
from ..database import get_db


class PresentationService:
    @staticmethod
    def create_presentation(db: Session, presentation_data: Dict) -> Presentation:
        """Create a new presentation with slides and content blocks"""
        # Create presentation
        presentation = Presentation(
            title=presentation_data['title'],
            description=presentation_data.get('description', ''),
            theme=presentation_data.get('theme', 'default'),
            settings=presentation_data.get('settings', {})
        )
        db.add(presentation)
        db.flush()  # Get the ID

        # Create slides
        for i, slide_data in enumerate(presentation_data.get('slides', [])):
            slide = Slide(
                presentation_id=presentation.id,
                order_index=i,
                title=slide_data.get('title', ''),
                layout=slide_data.get('layout', 'default'),
                background=slide_data.get('background', {}),
                animations=slide_data.get('animations', {})
            )
            db.add(slide)
            db.flush()  # Get the slide ID

            # Create content blocks
            for j, block_data in enumerate(slide_data.get('content_blocks', [])):
                content_block = ContentBlock(
                    slide_id=slide.id,
                    type=block_data['type'],
                    content=block_data.get('content', ''),
                    metadata=block_data.get('metadata', {}),
                    position_x=block_data.get('position_x', 0),
                    position_y=block_data.get('position_y', j * 100),
                    width=block_data.get('width', 100),
                    height=block_data.get('height', 50),
                    z_index=block_data.get('z_index', j),
                    styles=block_data.get('styles', {})
                )
                db.add(content_block)

        db.commit()
        db.refresh(presentation)
        return presentation

    @staticmethod
    def get_presentation_with_slides(db: Session, presentation_id: int) -> Optional[Dict]:
        """Get presentation with all slides and content blocks"""
        presentation = db.query(Presentation).filter(Presentation.id == presentation_id).first()
        if not presentation:
            return None

        result = {
            'id': presentation.id,
            'title': presentation.title,
            'description': presentation.description,
            'theme': presentation.theme,
            'settings': presentation.settings,
            'created_at': presentation.created_at,
            'updated_at': presentation.updated_at,
            'slides': []
        }

        for slide in sorted(presentation.slides, key=lambda x: x.order_index):
            slide_data = {
                'id': slide.id,
                'title': slide.title,
                'layout': slide.layout,
                'background': slide.background,
                'animations': slide.animations,
                'order_index': slide.order_index,
                'content_blocks': []
            }

            for block in sorted(slide.content_blocks, key=lambda x: x.z_index):
                block_data = {
                    'id': block.id,
                    'type': block.type,
                    'content': block.content,
                    'metadata': block.metadata,
                    'position_x': block.position_x,
                    'position_y': block.position_y,
                    'width': block.width,
                    'height': block.height,
                    'z_index': block.z_index,
                    'styles': block.styles
                }
                slide_data['content_blocks'].append(block_data)

            result['slides'].append(slide_data)

        return result