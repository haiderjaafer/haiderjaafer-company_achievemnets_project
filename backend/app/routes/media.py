# app/routes/media.py (UPDATED VERSION)
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.database import get_async_db
from app.models.media import Media
from app.models.categories import Category
from app.schemas.media import  MediaResponse
from app.schemas.responses import SuccessResponse, ErrorResponse, PaginatedResponse
from app.services.media_service import MediaService
from datetime import date, datetime
from typing import Any, Dict, List, Optional

router = APIRouter(prefix="/api/media", tags=["media"])



@router.get("/current-month")
async def get_media_current_month(
    category_id: int = Query(None, description="Optional: Filter by category ID"),
    media_type: str = Query(None, description="Optional: Filter by type - 'image' or 'video'"),
    db: AsyncSession = Depends(get_async_db)
) -> Dict[str, Any]:
    """
    Get ALL media from current month (Nov 1-30, 2025) with all images/videos paths
    
    No pagination - returns all matching records
    
    Query Parameters:
    - category_id: Optional - e.g., ?category_id=1 (for Maintenance category)
    - media_type: Optional - ?media_type=image or ?media_type=video
    
    Example requests:
    - GET /api/media/current-month
    - GET /api/media/current-month?category_id=1
    - GET /api/media/current-month?media_type=image
    - GET /api/media/current-month?category_id=1&media_type=image
    """
    
    # Get all media from current month
    media_list, start_date, end_date = await MediaService.get_media_current_month(
        db,
        category_id=category_id,
        media_type=media_type
    )
    
    # Build response with paths and category_name
    data = []
    for media in media_list:
        media_data = MediaResponse.from_orm(media).dict()
        
        # Add category_name
        media_data["category_name"] = media.category.category_name if media.category else None
        
        # Add paths to response
        media_data["paths"] = [
            {
                "id": path.id,
                "file_path": path.file_path,
                "file_name": path.file_name,
                "file_size": path.file_size,
                "file_extension": path.file_extension,
                "mime_type": path.mime_type,
                "is_primary": path.is_primary,
                "created_at": path.created_at.isoformat() if path.created_at else None
            }
            for path in media.paths
        ]
        
        data.append(media_data)
    
    # Return simple response (no pagination)
    return {
        "success": True,
        "data": data,
        "total": len(data),
        "date_range": {
            "start": start_date.isoformat(),
            "end": end_date.isoformat()
        }
    }