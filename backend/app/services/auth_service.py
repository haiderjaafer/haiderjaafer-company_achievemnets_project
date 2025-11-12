from datetime import datetime, timedelta
from typing import Optional
from jose import jwt
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from fastapi import HTTPException, status

from app.models import User
from app.Authentication.password import hash_password, verify_password
from app.database.config import settings
from app.schemas.auth import Token, RegisterRequest


class AuthService:
    """Service for authentication operations"""
    
    @staticmethod
    def create_access_token(
        user_id: int,
        username: str,
        permission: str,
        role: str,
        is_active: bool,
        expires_delta: Optional[timedelta] = None
    ) -> str:
        """
        Create JWT access token with user information
        
        Args:
            user_id: User's ID
            username: User's username
            permission: User's permission level
            role: User's role
            is_active: User's active status
            expires_delta: Token expiration time
            
        Returns:
            Encoded JWT token
        """
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(days=30)  # 30 days default
        
        payload = {
            "sub": str(user_id),  # ← CHANGED: Convert to string for JWT compliance
            "id": user_id,        # Keep as int for backward compatibility
            "username": username,
            "permission": permission,
            "role": role,
            "is_active": is_active,
            "exp": expire
        }
        
        encoded_jwt = jwt.encode(payload, settings.jwt_secret, algorithm="HS256")
        return encoded_jwt
    
    @staticmethod
    async def authenticate_user(
        db: AsyncSession,
        username: str,
        password: str
    ) -> Optional[User]:
        """
        Authenticate user with username and password
        """
        # Get user by username (case-insensitive)
        result = await db.execute(
            select(User).where(User.username.ilike(username))
        )
        user = result.scalar_one_or_none()
        
        if not user:
            return None
        
        # Verify password
        if not verify_password(password, user.password):
            return None
        
        # Update last login
        user.last_login = datetime.utcnow()
        await db.commit()
        
        return user
    
    @staticmethod
    async def login(
        db: AsyncSession,
        username: str,
        password: str
    ) -> tuple[str, User]:
        """
        Login user and return access token with user data
        
        Args:
            db: Database session
            username: Username
            password: Plain password
            
        Returns:
            Tuple of (access_token, user)
            
        Raises:
            HTTPException: If authentication fails
        """
        user = await AuthService.authenticate_user(db, username, password)
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User account is deactivated"
            )
        
        # Create access token with all user info
        access_token = AuthService.create_access_token(
            user_id=user.id,
            username=user.username,
            permission=user.permission,
            role=user.role,
            is_active=user.is_active
        )
        
        return access_token, user
    
    @staticmethod
    async def register(
        db: AsyncSession,
        user_data: RegisterRequest
    ) -> tuple[str, User]:
        """
        Register a new user
        
        Args:
            db: Database session
            user_data: Registration data
            
        Returns:
            Tuple of (access_token, user)
            
        Raises:
            HTTPException: If username already exists
        """
        # Check if username already exists (case-insensitive)
        result = await db.execute(
            select(User).where(User.username.ilike(user_data.username))
        )
        existing_user = result.scalar_one_or_none()
        
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already registered"
            )
        
        # Create new user
        hashed_password = hash_password(user_data.password)
        
        new_user = User(
            username=user_data.username.lower().strip(),
            password=hashed_password,
            permission=user_data.permission,
            role=user_data.role,
            is_active=True
        )
        
        db.add(new_user)
        await db.commit()
        await db.refresh(new_user)
        
        # Create access token
        access_token = AuthService.create_access_token(
            user_id=new_user.id,
            username=new_user.username,
            permission=new_user.permission,
            role=new_user.role,
            is_active=new_user.is_active
        )
        
        return access_token, new_user