import os
import uuid
import shutil
from pathlib import Path
from typing import List, Tuple
from fastapi import UploadFile, HTTPException, status
from datetime import datetime


class MediaUploadService:
    """Service for handling media file uploads"""
    
    # Allowed file extensions and MIME types
    ALLOWED_IMAGE_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'}
    ALLOWED_VIDEO_EXTENSIONS = {'.mp4', '.avi', '.mov', '.mkv', '.webm', '.flv'}
    
    ALLOWED_IMAGE_MIMES = {
        'image/jpeg', 'image/png', 'image/gif', 
        'image/webp', 'image/bmp'
    }
    ALLOWED_VIDEO_MIMES = {
        'video/mp4', 'video/x-msvideo', 'video/quicktime',
        'video/x-matroska', 'video/webm', 'video/x-flv'
    }
    
    # Maximum file sizes (in bytes)
    MAX_IMAGE_SIZE = 10 * 1024 * 1024  # 10 MB
    MAX_VIDEO_SIZE = 100 * 1024 * 1024  # 100 MB
    
    @staticmethod
    def validate_file_type(
        file: UploadFile,
        media_type: str
    ) -> Tuple[bool, str]:
        """
        Validate if uploaded file matches the specified media type
        
        Args:
            file: Uploaded file object
            media_type: Expected media type ('image' or 'video')
            
        Returns:
            Tuple of (is_valid: bool, error_message: str)
        """
        # Get file extension from filename
        file_ext = Path(file.filename).suffix.lower()
        
        # Check if media type is image
        if media_type == "image":
            # Validate extension
            if file_ext not in MediaUploadService.ALLOWED_IMAGE_EXTENSIONS:
                return False, f"Invalid image extension: {file_ext}. Allowed: {MediaUploadService.ALLOWED_IMAGE_EXTENSIONS}"
            
            # Validate MIME type
            if file.content_type not in MediaUploadService.ALLOWED_IMAGE_MIMES:
                return False, f"Invalid image MIME type: {file.content_type}"
        
        # Check if media type is video
        elif media_type == "video":
            # Validate extension
            if file_ext not in MediaUploadService.ALLOWED_VIDEO_EXTENSIONS:
                return False, f"Invalid video extension: {file_ext}. Allowed: {MediaUploadService.ALLOWED_VIDEO_EXTENSIONS}"
            
            # Validate MIME type
            if file.content_type not in MediaUploadService.ALLOWED_VIDEO_MIMES:
                return False, f"Invalid video MIME type: {file.content_type}"
        
        else:
            return False, f"Invalid media type: {media_type}"
        
        return True, ""
    
    @staticmethod
    async def save_upload_file(
        file: UploadFile,
        destination_path: Path,
        media_type: str
    ) -> Tuple[str, int]:
        """
        Save uploaded file to destination with validation
        
        Args:
            file: Uploaded file object
            destination_path: Path where file will be saved
            media_type: Type of media ('image' or 'video')
            
        Returns:
            Tuple of (saved_file_path: str, file_size: int)
            
        Raises:
            HTTPException: If file validation fails or save operation fails
        """
        # Validate file type
        is_valid, error_msg = MediaUploadService.validate_file_type(file, media_type)
        if not is_valid:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=error_msg
            )
        
        try:
            # Read file content to get size
            content = await file.read()
            file_size = len(content)
            
            # Validate file size
            if media_type == "image" and file_size > MediaUploadService.MAX_IMAGE_SIZE:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Image size exceeds maximum allowed size of {MediaUploadService.MAX_IMAGE_SIZE / (1024*1024)} MB"
                )
            
            if media_type == "video" and file_size > MediaUploadService.MAX_VIDEO_SIZE:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Video size exceeds maximum allowed size of {MediaUploadService.MAX_VIDEO_SIZE / (1024*1024)} MB"
                )
            
            # Generate unique filename to avoid collisions
            # Format: timestamp_uuid_originalname.ext
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            unique_id = str(uuid.uuid4())[:8]
            file_ext = Path(file.filename).suffix
            original_name = Path(file.filename).stem
            
            # Clean filename (remove special characters)
            safe_name = "".join(c for c in original_name if c.isalnum() or c in (' ', '-', '_')).strip()
            safe_name = safe_name[:50]  # Limit length
            
            new_filename = f"{timestamp}_{unique_id}_{safe_name}{file_ext}"
            full_path = destination_path / new_filename
            
            # Ensure destination directory exists
            destination_path.mkdir(parents=True, exist_ok=True)
            
            # Write file to disk
            with open(full_path, 'wb') as f:
                f.write(content)
            
            # Return the saved file path and size
            return str(full_path), file_size
            
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to save file: {str(e)}"
            )
        finally:
            # Reset file pointer for potential reuse
            await file.seek(0)
    
    @staticmethod
    def get_upload_directory(
        base_path: Path,
        media_type: str,
        user_id: int,
        category_id: int
    ) -> Path:
        """
        Generate organized upload directory path
        Structure: base_path/media_type/user_id/category_id/
        
        Args:
            base_path: Base upload directory
            media_type: Type of media ('image' or 'video')
            user_id: User ID who is uploading
            category_id: Category ID for the media
            
        Returns:
            Path object for upload directory
        """
        # Create organized directory structure
        # Example: /uploads/images/user_1/category_5/
        upload_dir = base_path / media_type / f"user_{user_id}" / f"category_{category_id}"
        
        return upload_dir
    
    @staticmethod
    def delete_file(file_path: str) -> bool:
        """
        Delete a file from disk
        
        Args:
            file_path: Full path to file
            
        Returns:
            True if successful, False otherwise
        """
        try:
            path = Path(file_path)
            if path.exists() and path.is_file():
                path.unlink()
                return True
            return False
        except Exception:
            return False