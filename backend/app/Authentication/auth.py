from fastapi import Depends, HTTPException, status, Cookie, Request, Header
from jose import JWTError, jwt
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional
import logging

from app.database.database import get_async_db
from app.database.config import settings
from app.models import User

logger = logging.getLogger(__name__)


async def get_current_user(
    request: Request,
    authorization: Optional[str] = Header(None),
    jwt_auth_token: Optional[str] = Cookie(None),
    db: AsyncSession = Depends(get_async_db)
) -> User:
    """
    Validate JWT token from cookie or Authorization header and return current user
    """
    logger.info("="*50)
    logger.info("AUTH DEBUG INFO:")
    logger.info(f"Authorization header: {authorization is not None}")
    logger.info(f"Cookie jwt_auth_token: {jwt_auth_token is not None}")
    
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    token = None
    
    # Try to get token from Authorization header
    if authorization:
        logger.info(f"Processing Authorization header: {authorization[:50]}...")
        parts = authorization.split()
        
        if len(parts) == 2 and parts[0].lower() == "bearer":
            token = parts[1]
            logger.info(f"✅ Extracted token from header")
        else:
            logger.error(f"❌ Invalid Authorization format. Parts: {len(parts)}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Invalid Authorization header format. Got {len(parts)} parts, expected 2"
            )
    
    # Try cookie if no header
    elif jwt_auth_token:
        token = jwt_auth_token
        logger.info(f"✅ Using token from cookie")
    
    # No token found
    if not token:
        logger.error("❌ No token found in header or cookie")
        raise credentials_exception
    
    # Decode token
    try:
        logger.info(f"Attempting to decode token...")
        
        payload = jwt.decode(token, settings.jwt_secret, algorithms=["HS256"])
        logger.info(f"✅ Token decoded successfully")
        
        # Get user_id from payload - handle both string and int
        user_id_raw = payload.get("sub") or payload.get("id")
        
        if user_id_raw is None:
            logger.error(f"❌ No user_id in payload. Payload keys: {payload.keys()}")
            raise credentials_exception
        
        # Convert to int (in case it's a string from JWT)
        try:
            user_id = int(user_id_raw)
        except (ValueError, TypeError):
            logger.error(f"❌ Invalid user_id format: {user_id_raw}")
            raise credentials_exception
        
        logger.info(f"✅ User ID from token: {user_id}")
            
    except JWTError as e:
        logger.error(f"❌ JWT decode error: {type(e).__name__}: {str(e)}")
        raise credentials_exception
    except Exception as e:
        logger.error(f"❌ Unexpected error: {type(e).__name__}: {str(e)}")
        raise credentials_exception
    
    # Get user from database
    try:
        result = await db.execute(
            select(User).where(User.id == user_id)
        )
        user = result.scalar_one_or_none()
        
        if user is None:
            logger.error(f"❌ User not found in DB: {user_id}")
            raise credentials_exception
        
        logger.info(f"✅ User authenticated: {user.username} (ID: {user.id})")
        return user
        
    except Exception as e:
        logger.error(f"❌ Database error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error during authentication"
        )


async def get_current_active_user(
    current_user: User = Depends(get_current_user)
) -> User:
    """Ensure user is active"""
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Inactive user account"
        )
    return current_user


async def require_admin(
    current_user: User = Depends(get_current_active_user)
) -> User:
    """Require admin permission"""
    if current_user.permission != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin permission required"
        )
    return current_user