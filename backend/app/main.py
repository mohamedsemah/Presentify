from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from .config import settings
from .database import engine, Base
from .routers import presentations, ai, export, media

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="EduPresent API",
    description="AI-Powered Educational Content Creation Platform",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create upload directory if it doesn't exist
os.makedirs(settings.upload_path, exist_ok=True)

# Static files
app.mount("/uploads", StaticFiles(directory=settings.upload_path), name="uploads")

# Include routers
app.include_router(presentations.router, prefix="/api/presentations", tags=["presentations"])
app.include_router(ai.router, prefix="/api/ai", tags=["ai"])
app.include_router(export.router, prefix="/api/export", tags=["export"])
app.include_router(media.router, prefix="/api/media", tags=["media"])

@app.get("/")
async def root():
    return {"message": "EduPresent API is running!"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}