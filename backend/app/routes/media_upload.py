from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, logger, status, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.database import get_async_db
from app.Authentication.auth import get_current_active_user
from app.models.users import User
from app.schemas.media import MediaCreateResponse, FileUploadResponse, MediaWithPaths
from app.services.media_service import MediaService

router = APIRouter(
    prefix="/api/media",
    tags=["Media Upload"]
)


@router.post("/upload", response_model=MediaCreateResponse, status_code=status.HTTP_201_CREATED)
async def upload_media_with_files(
    # Form fields - ALL come as strings from form-data
    title: str = Form(..., description="Media title"),
    category_id: str = Form(..., description="Category ID"),  # ← Changed to str
    media_type: str = Form(..., description="Media type: 'image' or 'video'"),
    description: Optional[str] = Form(None, description="Media description"),
    is_active: str = Form("true", description="Whether media is active"),  # ← Changed to str
    
    # Files array
    files: List[UploadFile] = File(..., description="Media files to upload (max 10)"),
    
    # Dependencies
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_async_db)
):
    """
    Upload media with one or multiple files (images or videos)
    
    **Form Data Fields:**
    - **title**: Media title (required)
    - **category_id**: Category ID as string (required, e.g., "1")
    - **media_type**: Type - 'image' or 'video' (required)
    - **description**: Media description (optional)
    - **is_active**: Active status as string - "true" or "false" (default: "true")
    - **files**: One or more files to upload (required, max 10 files)
    
    **Authentication:** Uses cookie or Bearer token
    """
    
    try:
        # Log received data for debugging
        # logger.info(f"Upload request from user: {current_user.username}")
        # logger.info(f"Title: {title}")
        # logger.info(f"Category ID (raw): {category_id}")
        # logger.info(f"Media type: {media_type}")
        # logger.info(f"Is active (raw): {is_active}")
        # logger.info(f"Files count: {len(files)}")
        
        # Convert and validate category_id (string to int)
        try:
            category_id_int = int(category_id)
            if category_id_int <= 0:
                raise ValueError("Category ID must be positive")
        except ValueError as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid category_id: must be a positive integer. Got: {category_id}"
            )
        
        # Convert and validate is_active (string to bool)
        is_active_bool = is_active.lower() in ('true', '1', 'yes', 'on')
        
        # Validate media_type
        if media_type not in ["image", "video"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"media_type must be 'image' or 'video'. Got: {media_type}"
            )
        
        # Validate files
        if not files:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="At least one file must be uploaded"
            )
        
        # logger.info(f"Validated data - category_id: {category_id_int}, is_active: {is_active_bool}")
        
        # Create media with files
        media, media_paths = await MediaService.create_media_with_files(
            db=db,
            title=title,
            category_id=category_id_int,  # Use converted int
            media_type=media_type,
            user_id=current_user.id,
            files=files,
            description=description,
            is_active=is_active_bool  # Use converted bool
        )
        
        # logger.info(f" Media created successfully: ID={media.id}, Files={len(media_paths)}")
        
        # Build response with uploaded file details
        uploaded_files = [
            FileUploadResponse(
                file_name=mp.file_name,
                file_size=mp.file_size,
                file_extension=mp.file_extension,
                mime_type=mp.mime_type or "",
                file_path=mp.file_path
            )
            for mp in media_paths
        ]
        
        return MediaCreateResponse(
            media_id=media.id,
            title=media.title,
            description=media.description,
            category_id=media.category_id,
            media_type=media.media_type,
            uploaded_files=uploaded_files,
            total_files=len(uploaded_files)
        )
        
    except HTTPException:
        raise
    except Exception as e:
        # logger.error(f"❌ Upload error: {type(e).__name__}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to upload media: {str(e)}"
        )


@router.get("/{media_id}/files", response_model=MediaWithPaths)
async def get_media_files(
    media_id: int,
    db: AsyncSession = Depends(get_async_db)
):
    """
    Get media details with all associated file paths
    
    **Path Parameter:**
    - **media_id**: Media ID
    
    **Returns:**
    - Media information
    - List of all file paths associated with this media
    """
    # Get media with paths
    media = await MediaService.get_media_with_paths(db, media_id)
    
    if not media:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Media with id {media_id} not found"
        )
    
    return media