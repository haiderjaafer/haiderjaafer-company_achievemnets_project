
from typing import List, Optional, Tuple
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_, or_, desc
from sqlalchemy.orm import selectinload
from fastapi import HTTPException, status

from app.models import Category, User
from app.schemas.category import CategoryCreate, CategoryUpdate, CategoryResponse


class CategoryService:
    """Service class for Category operations"""
    
    @staticmethod
    async def create_category(
        db: AsyncSession,
        category_data: CategoryCreate,
        user_id: int
    ) -> Category:
        """
        Create a new category
        
        Args:
            db: Database session
            category_data: Category creation data
            user_id: ID of the user creating the category
            
        Returns:
            Created Category object
            
        Raises:
            HTTPException: If category name already exists
        """
        # Check if category name already exists (case-insensitive)
        result = await db.execute(
            select(Category).where(
                func.lower(Category.category_name) == func.lower(category_data.category_name)
            )
        )
        existing_category = result.scalar_one_or_none()
        
        if existing_category:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Category '{category_data.category_name}' already exists"
            )
        
        # Create new category
        new_category = Category(
            category_name=category_data.category_name,
            description=category_data.description,
            icon=category_data.icon,
            color_code=category_data.color_code,
            sort_order=category_data.sort_order,
            is_active=category_data.is_active,
            created_by=user_id
        )
        
        db.add(new_category)
        await db.commit()
        await db.refresh(new_category)
        
        return new_category
    
    @staticmethod
    async def get_category_by_id(
        db: AsyncSession,
        category_id: int,
        include_creator: bool = False
    ) -> Optional[Category]:
        """
        Get category by ID
        
        Args:
            db: Database session
            category_id: Category ID
            include_creator: Whether to include creator user data
            
        Returns:
            Category object or None
        """
        query = select(Category).where(Category.id == category_id)
        
        if include_creator:
            query = query.options(selectinload(Category.creator))
        
        result = await db.execute(query)
        return result.scalar_one_or_none()
    
    @staticmethod
    async def get_all_categories(
        db: AsyncSession,
        skip: int = 0,
        limit: int = 100,
        is_active: Optional[bool] = None,
        search: Optional[str] = None,
        include_creator: bool = False
    ) -> Tuple[List[Category], int]:
        """
        Get all categories with optional filtering
        
        Args:
            db: Database session
            skip: Number of records to skip
            limit: Maximum number of records to return
            is_active: Filter by active status
            search: Search term for category name or description
            include_creator: Whether to include creator user data
            
        Returns:
            Tuple of (categories list, total count)
        """
        # Build base query
        query = select(Category)
        count_query = select(func.count(Category.id))
        
        # Apply filters
        conditions = []
        
        if is_active is not None:
            conditions.append(Category.is_active == is_active)
        
        if search:
            search_term = f"%{search}%"
            conditions.append(
                or_(
                    Category.category_name.ilike(search_term),
                    Category.description.ilike(search_term)
                )
            )
        
        if conditions:
            query = query.where(and_(*conditions))
            count_query = count_query.where(and_(*conditions))
        
        # Get total count
        total_result = await db.execute(count_query)
        total = total_result.scalar_one()
        
        # Apply ordering (by sort_order, then by name)
        query = query.order_by(Category.sort_order.asc(), Category.category_name.asc())
        
        # Apply pagination
        query = query.offset(skip).limit(limit)
        
        # Include creator if requested
        if include_creator:
            query = query.options(selectinload(Category.creator))
        
        # Execute query
        result = await db.execute(query)
        categories = result.scalars().all()
        
        return list(categories), total
    
    @staticmethod
    async def get_active_categories(
        db: AsyncSession,
        include_creator: bool = False
    ) -> List[Category]:
        """
        Get all active categories (for dropdowns, etc.)
        
        Args:
            db: Database session
            include_creator: Whether to include creator user data
            
        Returns:
            List of active Category objects
        """
        query = select(Category).where(
            Category.is_active == True
        ).order_by(Category.sort_order.asc(), Category.category_name.asc())
        
        if include_creator:
            query = query.options(selectinload(Category.creator))
        
        result = await db.execute(query)
        return list(result.scalars().all())
    
    @staticmethod
    async def update_category(
        db: AsyncSession,
        category_id: int,
        category_data: CategoryUpdate,
        user_id: int
    ) -> Category:
        """
        Update category
        
        Args:
            db: Database session
            category_id: Category ID to update
            category_data: Update data
            user_id: ID of user performing update
            
        Returns:
            Updated Category object
            
        Raises:
            HTTPException: If category not found or name conflict
        """
        # Get existing category
        category = await CategoryService.get_category_by_id(db, category_id)
        
        if not category:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Category with id {category_id} not found"
            )
        
        # Check for name conflict if name is being changed
        if category_data.category_name and category_data.category_name != category.category_name:
            result = await db.execute(
                select(Category).where(
                    func.lower(Category.category_name) == func.lower(category_data.category_name),
                    Category.id != category_id
                )
            )
            existing_category = result.scalar_one_or_none()
            
            if existing_category:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Category '{category_data.category_name}' already exists"
                )
        
        # Update fields
        update_data = category_data.model_dump(exclude_unset=True)
        
        for field, value in update_data.items():
            if hasattr(category, field):
                setattr(category, field, value)
        
        # Update timestamp
        category.updated_at = func.getutcdate()
        
        await db.commit()
        await db.refresh(category)
        
        return category
    
    @staticmethod
    async def delete_category(
        db: AsyncSession,
        category_id: int,
        hard_delete: bool = False
    ) -> bool:
        """
        Delete or deactivate category
        
        Args:
            db: Database session
            category_id: Category ID to delete
            hard_delete: If True, permanently delete; if False, deactivate
            
        Returns:
            True if successful
            
        Raises:
            HTTPException: If category not found or has associated media
        """
        category = await CategoryService.get_category_by_id(db, category_id)
        
        if not category:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Category with id {category_id} not found"
            )
        
        # Check if category has associated media
        from app.models import Media
        media_count_result = await db.execute(
            select(func.count(Media.id)).where(Media.category_id == category_id)
        )
        media_count = media_count_result.scalar_one()
        
        if media_count > 0 and hard_delete:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Cannot delete category with {media_count} associated media items. Deactivate instead."
            )
        
        if hard_delete:
            await db.delete(category)
        else:
            category.is_active = False
            category.updated_at = func.getutcdate()
        
        await db.commit()
        return True
    
    @staticmethod
    async def toggle_category_status(
        db: AsyncSession,
        category_id: int
    ) -> Category:
        """
        Toggle category active status
        
        Args:
            db: Database session
            category_id: Category ID
            
        Returns:
            Updated Category object
            
        Raises:
            HTTPException: If category not found
        """
        category = await CategoryService.get_category_by_id(db, category_id)
        
        if not category:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Category with id {category_id} not found"
            )
        
        category.is_active = not category.is_active
        category.updated_at = func.getutcdate()
        
        await db.commit()
        await db.refresh(category)
        
        return category
    
    @staticmethod
    async def get_category_stats(
        db: AsyncSession,
        category_id: int
    ) -> dict:
        """
        Get statistics for a category
        
        Args:
            db: Database session
            category_id: Category ID
            
        Returns:
            Dictionary with category statistics
            
        Raises:
            HTTPException: If category not found
        """
        category = await CategoryService.get_category_by_id(db, category_id)
        
        if not category:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Category with id {category_id} not found"
            )
        
        from app.models import Media
        
        # Count total media
        total_media_result = await db.execute(
            select(func.count(Media.id)).where(Media.category_id == category_id)
        )
        total_media = total_media_result.scalar_one()
        
        # Count active media
        active_media_result = await db.execute(
            select(func.count(Media.id)).where(
                Media.category_id == category_id,
                Media.is_active == True
            )
        )
        active_media = active_media_result.scalar_one()
        
        # Count by media type
        image_count_result = await db.execute(
            select(func.count(Media.id)).where(
                Media.category_id == category_id,
                Media.media_type == 'image'
            )
        )
        image_count = image_count_result.scalar_one()
        
        video_count_result = await db.execute(
            select(func.count(Media.id)).where(
                Media.category_id == category_id,
                Media.media_type == 'video'
            )
        )
        video_count = video_count_result.scalar_one()
        
        return {
            "category_id": category_id,
            "category_name": category.category_name,
            "total_media": total_media,
            "active_media": active_media,
            "inactive_media": total_media - active_media,
            "image_count": image_count,
            "video_count": video_count
        }