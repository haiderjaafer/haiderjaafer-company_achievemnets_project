from pydantic import BaseModel, Field, ConfigDict, field_validator
from datetime import datetime
from typing import Optional, List
from enum import Enum


class MediaTypeEnum(str, Enum):
    """Enum for media types"""
    IMAGE = "image"
    VIDEO = "video"


class MediaBase(BaseModel):
    """Base schema for Media"""
    title: str = Field(..., min_length=1, max_length=255, description="Media title")
    description: Optional[str] = Field(None, max_length=1000, description="Media description")
    category_id: int = Field(..., gt=0, description="Category ID")
    media_type: MediaTypeEnum = Field(..., description="Type of media: image or video")
    is_active: bool = Field(default=True, description="Whether media is active")


class MediaCreate(MediaBase):
    """Schema for creating new Media (without files, files handled separately)"""
    pass


# New schema for file upload response
class FileUploadResponse(BaseModel):
    """Response schema for uploaded file"""
    file_name: str
    file_size: int
    file_extension: str
    mime_type: str
    file_path: str


class MediaCreateResponse(BaseModel):
    """Response after creating media with files"""
    media_id: int
    title: str
    description: Optional[str]
    category_id: int
    media_type: str
    uploaded_files: List[FileUploadResponse]
    total_files: int
    
    model_config = ConfigDict(from_attributes=True)


class MediaResponse(MediaBase):
    """Schema for Media response"""
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime
    updated_by: Optional[int] = None
    
    model_config = ConfigDict(from_attributes=True)


class MediaPathResponse(BaseModel):
    """Schema for MediaPath response"""
    id: int
    media_id: int
    file_path: str
    file_name: str
    file_size: int
    file_extension: str
    mime_type: Optional[str]
    is_primary: bool
    sort_order: int
    created_at: datetime
    created_by: int
    
    model_config = ConfigDict(from_attributes=True)


class MediaWithPaths(MediaResponse):
    """Schema for Media with associated file paths"""
    paths: List[MediaPathResponse] = Field(default_factory=list)
    
    model_config = ConfigDict(from_attributes=True)