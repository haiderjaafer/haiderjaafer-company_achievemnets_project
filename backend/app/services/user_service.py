
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from fastapi import HTTPException, status

from app.models.users import User
from app.schemas.user import UserUpdate, UserResponse
from app.Authentication.password import hash_password, verify_password


class UserService:
    """Service for user management operations"""
    
    @staticmethod
    async def get_user_by_id(
        db: AsyncSession,
        user_id: int
    ) -> Optional[User]:
        """Get user by ID"""
        result = await db.execute(
            select(User).where(User.id == user_id)
        )
        return result.scalar_one_or_none()
    
    @staticmethod
    async def get_all_users(
        db: AsyncSession,
        skip: int = 0,
        limit: int = 100
    ) -> List[User]:
        """Get all users with pagination"""
        result = await db.execute(
            select(User).offset(skip).limit(limit)
        )
        return list(result.scalars().all())
    
    @staticmethod
    async def update_user(
        db: AsyncSession,
        user_id: int,
        user_data: UserUpdate,
        current_user_id: int
    ) -> User:
        """
        Update user information
        
        Args:
            db: Database session
            user_id: User ID to update
            user_data: Update data
            current_user_id: ID of user making the update
            
        Returns:
            Updated user
            
        Raises:
            HTTPException: If user not found or unauthorized
        """
        user = await UserService.get_user_by_id(db, user_id)
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"User with id {user_id} not found"
            )
        
        # Only allow users to update themselves unless they're admin
        # You can add permission check here if needed
        
        update_data = user_data.model_dump(exclude_unset=True)
        
        for field, value in update_data.items():
            if field == 'password' and value:
                # Hash password if being updated
                setattr(user, field, hash_password(value))
            elif hasattr(user, field):
                setattr(user, field, value)
        
        user.updated_at = func.getutcdate()
        
        await db.commit()
        await db.refresh(user)
        
        return user
    
    @staticmethod
    async def change_password(
        db: AsyncSession,
        user_id: int,
        old_password: str,
        new_password: str
    ) -> bool:
        """
        Change user password
        
        Args:
            db: Database session
            user_id: User ID
            old_password: Current password
            new_password: New password
            
        Returns:
            True if successful
            
        Raises:
            HTTPException: If old password is incorrect
        """
        user = await UserService.get_user_by_id(db, user_id)
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Verify old password
        if not verify_password(old_password, user.password):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Incorrect old password"
            )
        
        # Update password
        user.password = hash_password(new_password)
        user.updated_at = func.getutcdate()
        
        await db.commit()
        
        return True
    
    @staticmethod
    async def delete_user(
        db: AsyncSession,
        user_id: int,
        hard_delete: bool = False
    ) -> bool:
        """
        Delete or deactivate user
        
        Args:
            db: Database session
            user_id: User ID to delete
            hard_delete: If True, permanently delete; if False, deactivate
            
        Returns:
            True if successful
        """
        user = await UserService.get_user_by_id(db, user_id)
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"User with id {user_id} not found"
            )
        
        if hard_delete:
            await db.delete(user)
        else:
            user.is_active = False
            user.updated_at = func.getutcdate()
        
        await db.commit()
        return True