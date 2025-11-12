from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
import logging

from app.database.database import get_async_db
from app.Authentication.auth import get_current_active_user, require_admin
from app.models import User
from app.schemas.category import CategoryCreate, CategoryResponse, CategoryUpdate
from app.services.category_service import CategoryService

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/api/categories",
    tags=["Categories"]
)


@router.post("/", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
async def create_category(
    category_data: CategoryCreate,
    current_user: User = Depends(require_admin),  # Only admins can create categories
    db: AsyncSession = Depends(get_async_db)
):
    """
    Create a new category (Admin only)
    
    - **category_name**: Unique category name (required, max 100 chars)
    - **description**: Category description (optional, max 500 chars)
    - **icon**: Icon name/class (optional, max 50 chars)
    - **color_code**: Hex color code (optional, e.g., #FF5733)
    - **sort_order**: Display order (default: 0)
    - **is_active**: Whether category is active (default: true)
    
    **Requires:** Admin permission
    """
    try:
        logger.info(f"Admin {current_user.username} creating category: {category_data.category_name}")
        
        category = await CategoryService.create_category(
            db=db,
            category_data=category_data,
            user_id=current_user.id
        )
        
        logger.info(f"Category created successfully: {category.category_name} (ID: {category.id})")
        return category
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating category: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create category: {str(e)}"
        )


@router.get("/", response_model=List[CategoryResponse])
async def get_categories(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=100, description="Maximum records to return"),
    is_active: Optional[bool] = Query(None, description="Filter by active status"),
    search: Optional[str] = Query(None, max_length=100, description="Search term"),
    db: AsyncSession = Depends(get_async_db)
):
    """
    Get all categories with optional filtering
    
    **Query Parameters:**
    - **skip**: Pagination offset (default: 0)
    - **limit**: Items per page (default: 100, max: 100)
    - **is_active**: Filter by active status (true/false)
    - **search**: Search in category name and description
    
    **Public endpoint** - No authentication required
    """

    try:
        logger.info(f"Retrieved  categories ")
        categories, total = await CategoryService.get_all_categories(
            db=db,
            skip=skip,
            limit=limit,
            is_active=is_active,
            search=search
        )
        
        logger.info(f"Retrieved {len(categories)} categories (total: {total})")
        return categories
        
    except Exception as e:
        logger.error(f"Error fetching categories: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch categories"
        )


@router.get("/active", response_model=List[CategoryResponse])
async def get_active_categories(
    db: AsyncSession = Depends(get_async_db)
):
    """
    Get all active categories (for dropdowns, filters, etc.)
    
    Returns only active categories, ordered by sort_order and name.
    
    **Public endpoint** - No authentication required
    **Use this endpoint for category dropdowns in forms**
    """
    try:
        categories = await CategoryService.get_active_categories(db=db)
        
        logger.info(f"Retrieved {len(categories)} active categories")
        return categories
        
    except Exception as e:
        logger.error(f"Error fetching active categories: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch active categories"
        )



@router.get("/{category_id}")
async def get_category_by_id(
    category_id: int,
    db: AsyncSession = Depends(get_async_db)
):
    """Get category by ID with creator information"""
    try:
        category = await CategoryService.get_category_by_id(
            db=db,
            category_id=category_id,
            include_creator=True
        )
        
        if not category:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Category with id {category_id} not found"
            )
        
        # Manually construct response to avoid circular import
        return {
            "id": category.id,
            "category_name": category.category_name,
            "description": category.description,
            "icon": category.icon,
            "color_code": category.color_code,
            "sort_order": category.sort_order,
            "is_active": category.is_active,
            "created_at": category.created_at,
            "created_by": category.created_by,
            "updated_at": category.updated_at,
            "creator": {
                "id": category.creator.id,
                "username": category.creator.username,
                "permission": category.creator.permission,
                "role": category.creator.role,
                "is_active": category.creator.is_active,
                "created_at": category.creator.created_at,
                "updated_at": category.creator.updated_at
            } if category.creator else None
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching category {category_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch category"
        )





@router.put("/{category_id}", response_model=CategoryResponse)
async def update_category(
    category_id: int,
    category_data: CategoryUpdate,
    current_user: User = Depends(require_admin),  # Only admins can update
    db: AsyncSession = Depends(get_async_db)
):
    """
    Update category (Admin only)
    
    All fields are optional. Only provided fields will be updated.
    
    **Requires:** Admin permission
    """
    try:
        logger.info(f"Admin {current_user.username} updating category {category_id}")
        
        category = await CategoryService.update_category(
            db=db,
            category_id=category_id,
            category_data=category_data,
            user_id=current_user.id
        )
        
        logger.info(f"Category {category_id} updated successfully")
        return category
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating category {category_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update category: {str(e)}"
        )


@router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_category(
    category_id: int,
    hard_delete: bool = Query(False, description="Permanently delete (true) or deactivate (false)"),
    current_user: User = Depends(require_admin),  # Only admins can delete
    db: AsyncSession = Depends(get_async_db)
):
    """
    Delete or deactivate category (Admin only)
    
    **Query Parameter:**
    - **hard_delete=false**: Deactivates category (soft delete)
    - **hard_delete=true**: Permanently deletes (only if no associated media)
    
    **Requires:** Admin permission
    """
    try:
        logger.info(f"Admin {current_user.username} {'deleting' if hard_delete else 'deactivating'} category {category_id}")
        
        await CategoryService.delete_category(
            db=db,
            category_id=category_id,
            hard_delete=hard_delete
        )
        
        logger.info(f"Category {category_id} {'deleted' if hard_delete else 'deactivated'} successfully")
        return None
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting category {category_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete category"
        )


@router.patch("/{category_id}/toggle", response_model=CategoryResponse)
async def toggle_category_status(
    category_id: int,
    current_user: User = Depends(require_admin),  # Only admins can toggle status
    db: AsyncSession = Depends(get_async_db)
):
    """
    Toggle category active status (Admin only)
    
    Switches between active and inactive state.
    
    **Requires:** Admin permission
    """
    try:
        category = await CategoryService.toggle_category_status(db, category_id)
        
        logger.info(f"Category {category_id} status toggled to: {category.is_active}")
        return category
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error toggling category {category_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to toggle category status"
        )


@router.get("/{category_id}/stats")
async def get_category_statistics(
    category_id: int,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_async_db)
):
    """
    Get statistics for a category
    
    Returns:
    - Total media count
    - Active/inactive media count
    - Image/video count
    
    **Requires:** Authentication
    """
    try:
        stats = await CategoryService.get_category_stats(db, category_id)
        return stats
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching stats for category {category_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch category statistics"
        )