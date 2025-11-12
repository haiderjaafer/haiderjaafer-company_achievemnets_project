from datetime import date, datetime
from typing import List, Optional, Tuple
from pathlib import Path
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import and_, desc, select, func
from fastapi import HTTPException, status, UploadFile
from sqlalchemy.orm import selectinload
from app.models.media import Media 
from app.models.categories import Category
from app.models.media_path import MediaPath
from app.services.media_upload_service import MediaUploadService
from app.database.config import settings
from dateutil.relativedelta import relativedelta


class MediaService:
    """Service class for Media operations"""
    
    @staticmethod
    async def create_media_with_files(
        db: AsyncSession,
        title: str,
        category_id: int,
        media_type: str,
        user_id: int,
        files: List[UploadFile],
        description: Optional[str] = None,
        is_active: bool = True
    ) -> Tuple[Media, List[MediaPath]]:
        """
        Create media record with multiple file uploads
        
        Args:
            db: Database session
            title: Media title
            category_id: Category ID
            media_type: Type of media ('image' or 'video')
            user_id: User ID creating the media
            files: List of uploaded files
            description: Optional media description
            is_active: Whether media is active
            
        Returns:
            Tuple of (Media object, List of MediaPath objects)
            
        Raises:
            HTTPException: If validation fails or file operations fail
        """
        # Step 1: Verify category exists and is active
        category_result = await db.execute(
            select(Category).where(
                Category.id == category_id,
                Category.is_active == True
            )
        )
        category = category_result.scalar_one_or_none()
        
        if not category:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Category with id {category_id} not found or inactive"
            )
        
        # Step 2: Validate that at least one file is provided
        if not files or len(files) == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="At least one file must be uploaded"
            )
        
        # Step 3: Validate file count (max 10 files per media)
        if len(files) > 10:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Maximum 10 files allowed per media upload"
            )
        
        try:
            # Step 4: Create Media record in database
            new_media = Media(
                title=title,
                description=description,
                category_id=category_id,
                user_id=user_id,
                media_type=media_type,
                is_active=is_active
            )
            
            db.add(new_media)
            await db.flush()  # Flush to get media.id without committing
            
            # Step 5: Get upload directory path
            # Uses PDF_UPLOAD_PATH from settings as base directory
            base_upload_path = Path(settings.PDF_UPLOAD_PATH)
            upload_dir = MediaUploadService.get_upload_directory(
                base_path=base_upload_path,
                media_type=media_type,
                user_id=user_id,
                category_id=category_id
            )
            
            # Step 6: Process and save each uploaded file
            media_paths = []
            for index, file in enumerate(files):
                # Save file to disk and get path and size
                saved_path, file_size = await MediaUploadService.save_upload_file(
                    file=file,
                    destination_path=upload_dir,
                    media_type=media_type
                )
                
                # Extract file metadata
                file_name = Path(saved_path).name
                file_extension = Path(file.filename).suffix.lower().lstrip('.')
                mime_type = file.content_type
                
                # Determine if this is the primary file (first file is primary)
                is_primary = (index == 0)
                
                # Create MediaPath record
                media_path = MediaPath(
                    media_id=new_media.id,
                    file_path=saved_path,
                    file_name=file_name,
                    file_size=file_size,
                    file_extension=file_extension,
                    mime_type=mime_type,
                    is_primary=is_primary,
                    sort_order=index,
                    created_by=user_id
                )
                
                db.add(media_path)
                media_paths.append(media_path)
            
            # Step 7: Commit all changes to database
            await db.commit()
            await db.refresh(new_media)
            
            # Step 8: Refresh all media_path objects to get their IDs
            for mp in media_paths:
                await db.refresh(mp)
            
            return new_media, media_paths
            
        except HTTPException:
            # Rollback database changes on HTTP exceptions
            await db.rollback()
            raise
        except Exception as e:
            # Rollback database changes on any other exception
            await db.rollback()
            
            # Try to cleanup uploaded files if database operation failed
            # (This prevents orphaned files on disk)
            try:
                for mp in media_paths:
                    if hasattr(mp, 'file_path'):
                        MediaUploadService.delete_file(mp.file_path)
            except:
                pass
            
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to create media: {str(e)}"
            )
    
    @staticmethod
    async def get_media_with_paths(
        db: AsyncSession,
        media_id: int
    ) -> Optional[Media]:
        """
        Get media by ID with all file paths loaded
        
        Args:
            db: Database session
            media_id: Media ID
            
        Returns:
            Media object with paths relationship loaded, or None
        """
        from sqlalchemy.orm import selectinload
        
        # Query media with paths eagerly loaded
        result = await db.execute(
            select(Media)
            .where(Media.id == media_id)
            .options(selectinload(Media.paths))
        )
        
        return result.scalar_one_or_none()
    


    @staticmethod
    async def get_media_current_month(
        db: AsyncSession,
        category_id: int = None,
        media_type: str = None
    ) -> Tuple[List[Media], date, date]:
        """
        Get ALL media from current month with all their file paths and category info
        
        Example: If today is 2025-11-15, returns all media from 2025-11-01 to 2025-11-30
        
        Args:
            db: Database session
            category_id: Optional - filter by category (e.g., 1)
            media_type: Optional - filter by type ('image' or 'video')
            
        Returns:
            Tuple of (media_list, start_date, end_date)
        """
        
        today = date.today()
        
        # Get first day of current month
        start_date = date(today.year, today.month, 1)
        
        # Get last day of current month
        end_date = start_date + relativedelta(months=1) - relativedelta(days=1)
        
        # Convert to datetime for database query
        start_datetime = datetime.combine(start_date, datetime.min.time())
        end_datetime = datetime.combine(end_date, datetime.max.time())
        
        # Build query
        query = select(Media).where(
            and_(
                Media.is_active == True,
                Media.created_at >= start_datetime,
                Media.created_at <= end_datetime
            )
        )
        
        # Apply optional filters
        if category_id:
            query = query.where(Media.category_id == category_id)
        if media_type:
            query = query.where(Media.media_type == media_type)
        
        # Order by created date (newest first)
        query = query.order_by(desc(Media.created_at))
        
        # Load all relationships (including paths and category)
        query = query.options(
            selectinload(Media.paths),
            selectinload(Media.category)
        )
        
        # Execute query
        result = await db.execute(query)
        media_list = result.scalars().all()
        
        return media_list, start_date, end_date    



