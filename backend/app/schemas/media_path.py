from pydantic import BaseModel, Field, ConfigDict, field_validator
from datetime import datetime
from typing import Optional


class MediaPathBase(BaseModel):
    """Base schema for MediaPath"""
    file_path: str = Field(..., min_length=1, max_length=4000)
    file_name: str = Field(..., min_length=1, max_length=255)
    file_size: int = Field(..., gt=0, description="File size in bytes")
    file_extension: str = Field(..., min_length=1, max_length=10, description="File extension without dot")
    mime_type: Optional[str] = Field(None, max_length=100, description="MIME type of the file")
    is_primary: bool = Field(default=False, description="Whether this is the primary file")
    sort_order: int = Field(default=0, ge=0, description="Display order")

    @field_validator('file_extension')
    @classmethod
    def validate_extension(cls, v: str) -> str:
        """Remove leading dot if present and convert to lowercase"""
        return v.lstrip('.').lower()

    @field_validator('mime_type')
    @classmethod
    def validate_mime_type(cls, v: Optional[str]) -> Optional[str]:
        """Validate MIME type format"""
        if v and '/' not in v:
            raise ValueError("Invalid MIME type format. Expected format: 'type/subtype'")
        return v


class MediaPathCreate(MediaPathBase):
    """Schema for creating a new MediaPath"""
    media_id: int = Field(..., gt=0, description="Associated media ID")
    # created_by will be set from JWT token in the route


class MediaPathUpdate(BaseModel):
    """Schema for updating MediaPath"""
    file_path: Optional[str] = Field(None, min_length=1, max_length=4000)
    file_name: Optional[str] = Field(None, min_length=1, max_length=255)
    file_size: Optional[int] = Field(None, gt=0)
    file_extension: Optional[str] = Field(None, min_length=1, max_length=10)
    mime_type: Optional[str] = Field(None, max_length=100)
    is_primary: Optional[bool] = None
    sort_order: Optional[int] = Field(None, ge=0)

    @field_validator('file_extension')
    @classmethod
    def validate_extension(cls, v: Optional[str]) -> Optional[str]:
        if v:
            return v.lstrip('.').lower()
        return v


class MediaPathResponse(MediaPathBase):
    """Schema for MediaPath response"""
    id: int
    media_id: int
    created_at: datetime
    created_by: int
    
    model_config = ConfigDict(from_attributes=True)


class MediaPathWithCreator(MediaPathResponse):
    """Schema for MediaPath with creator details"""
    from app.schemas.user import UserResponse
    created_user: UserResponse
    
    model_config = ConfigDict(from_attributes=True)