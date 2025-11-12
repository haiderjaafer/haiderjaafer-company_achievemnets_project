from pydantic import BaseModel, Field, ConfigDict, field_validator
from datetime import datetime
from typing import Optional, Any


class CategoryBase(BaseModel):
    """Base schema for Category"""
    category_name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    icon: Optional[str] = Field(None, max_length=50)
    color_code: Optional[str] = Field(None, pattern="^#[0-9A-Fa-f]{6}$")
    sort_order: Optional[int] = Field(default=0, ge=0)
    is_active: bool = Field(default=True)


class CategoryCreate(CategoryBase):
    """Schema for creating new Category"""
    pass


class CategoryUpdate(BaseModel):
    """Schema for updating Category"""
    category_name: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    icon: Optional[str] = Field(None, max_length=50)
    color_code: Optional[str] = Field(None, pattern="^#[0-9A-Fa-f]{6}$")
    sort_order: Optional[int] = Field(None, ge=0)
    is_active: Optional[bool] = None


class CategoryResponse(CategoryBase):
    """Schema for Category response"""
    id: int
    created_at: datetime
    created_by: int
    updated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


# Don't use this in the router - manually construct response instead
class CategoryWithCreatorDict(CategoryResponse):
    """Schema with creator as dict (avoids circular import)"""
    creator: dict[str, Any] = Field(default_factory=dict)
    
    model_config = ConfigDict(from_attributes=True)