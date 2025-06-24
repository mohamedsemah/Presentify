import os
import uuid
import aiofiles
from PIL import Image
from typing import Optional, Tuple
from ..config import settings


class MediaService:
    @staticmethod
    async def save_uploaded_file(file_content: bytes, filename: str, mime_type: str) -> Dict:
        """Save uploaded file and return metadata"""
        # Generate unique filename
        file_extension = os.path.splitext(filename)[1].lower()
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        file_path = os.path.join(settings.upload_path, unique_filename)

        # Save file
        async with aiofiles.open(file_path, 'wb') as f:
            await f.write(file_content)

        # Get image dimensions if it's an image
        width, height = None, None
        if mime_type.startswith('image/'):
            try:
                with Image.open(file_path) as img:
                    width, height = img.size
            except:
                pass

        return {
            'filename': unique_filename,
            'original_filename': filename,
            'file_path': file_path,
            'file_size': len(file_content),
            'mime_type': mime_type,
            'width': width,
            'height': height
        }

    @staticmethod
    def optimize_image(file_path: str, max_width: int = 1920, quality: int = 85) -> str:
        """Optimize image for web use"""
        try:
            with Image.open(file_path) as img:
                # Convert to RGB if necessary
                if img.mode in ('RGBA', 'LA', 'P'):
                    img = img.convert('RGB')

                # Resize if too large
                if img.width > max_width:
                    ratio = max_width / img.width
                    new_height = int(img.height * ratio)
                    img = img.resize((max_width, new_height), Image.Resampling.LANCZOS)

                # Save optimized version
                optimized_path = file_path.replace('.', '_optimized.')
                img.save(optimized_path, 'JPEG', quality=quality, optimize=True)
                return optimized_path
        except Exception as e:
            print(f"Image optimization failed: {e}")
            return file_path

        return file_path
