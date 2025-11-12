
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.database import get_async_db
from app.schemas.user import UserResponse, UserUpdate
from app.services.user_service import UserService
from app.Authentication.auth import get_current_active_user
from app.models.users import User

router = APIRouter(
    prefix="/api/users",
    tags=["Users"]
)


@router.get("/", response_model=List[UserResponse])
async def get_all_users(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_async_db)
):
    """
    Get all users (paginated)
    
    Requires authentication
    """
    users = await UserService.get_all_users(db, skip, limit)
    return users


@router.get("/{user_id}", response_model=UserResponse)
async def get_user_by_id(
    user_id: int,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_async_db)
):
    """
    Get user by ID
    
    Requires authentication
    """
    user = await UserService.get_user_by_id(db, user_id)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with id {user_id} not found"
        )
    
    return user


@router.put("/{user_id}", response_model=UserResponse)
async def update_user(
    user_id: int,
    user_data: UserUpdate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_async_db)
):
    """
    Update user information
    
    Users can only update their own information unless they're admin
    """
    # Optional: Add admin check here
    if current_user.id != user_id and current_user.permission != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this user"
        )
    
    user = await UserService.update_user(db, user_id, user_data, current_user.id)
    return user


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(
    user_id: int,
    hard_delete: bool = Query(False),
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_async_db)
):
    """
    Delete or deactivate user
    
    Only admins can delete users
    """
    if current_user.permission != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can delete users"
        )
    
    await UserService.delete_user(db, user_id, hard_delete)
    return None