# app/schemas/responses.py
from pydantic import BaseModel, Field
from typing import TypeVar, Generic, List, Optional, Any

T = TypeVar('T')


class SuccessResponse(BaseModel, Generic[T]):
    """Generic success response schema"""
    success: bool = Field(default=True, description="Success status")
    message: str = Field(..., description="Success message")
    data: Optional[T] = Field(None, description="Response data")
    
    class Config:
        json_schema_extra = {
            "example": {
                "success": True,
                "message": "Operation completed successfully",
                "data": {}
            }
        }


class ErrorResponse(BaseModel):
    """Generic error response schema"""
    success: bool = Field(default=False, description="Success status")
    message: str = Field(..., description="Error message")
    error_code: Optional[str] = Field(None, description="Error code")
    details: Optional[dict] = Field(None, description="Additional error details")
    
    class Config:
        json_schema_extra = {
            "example": {
                "success": False,
                "message": "An error occurred",
                "error_code": "INTERNAL_ERROR",
                "details": {}
            }
        }


class PaginatedResponse(BaseModel, Generic[T]):
    """Generic paginated response schema"""
    success: bool = Field(default=True, description="Success status")
    data: List[T] = Field(default_factory=list, description="List of items")
    total: int = Field(default=0, description="Total number of items")
    page: int = Field(default=1, description="Current page number")
    limit: int = Field(default=10, description="Items per page")
    total_pages: int = Field(default=0, description="Total number of pages")
    has_next: bool = Field(default=False, description="Has next page")
    has_previous: bool = Field(default=False, description="Has previous page")
    
    class Config:
        json_schema_extra = {
            "example": {
                "success": True,
                "data": [],
                "total": 100,
                "page": 1,
                "limit": 10,
                "total_pages": 10,
                "has_next": True,
                "has_previous": False
            }
        }