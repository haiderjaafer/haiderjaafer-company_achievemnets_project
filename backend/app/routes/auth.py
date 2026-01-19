import os
from fastapi import APIRouter, Depends, HTTPException, Request, status, Response
from sqlalchemy.ext.asyncio import AsyncSession
import logging

from app.database.database import get_async_db
from app.database.config import settings
from app.schemas.auth import LoginRequest, RegisterRequest
from app.schemas.user import UserResponse
from app.services.auth_service import AuthService
from app.services.user_service import UserService
from app.Authentication.auth import get_current_active_user
from app.models.users import User

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"]
)


def set_auth_cookie(response: Response, token: str):
    """
    Helper function to set authentication cookie
    
    Args:
        response: FastAPI Response object
        token: JWT token to set in cookie
    """
    is_production = settings.node_env == "production"
    
    # response.set_cookie(
    #     key="jwt_auth_token",
    #     value=token,
    #     httponly=True,              # Prevent JavaScript access
    #     secure=is_production,       # HTTPS only in production
    #     samesite="lax",             # CSRF protection
    #     max_age=60 * 60 * 24 * 30,  # 30 days
    #     path="/",                   # Available site-wide
    # )

    response.set_cookie(
            key="jwt_auth_token",
            value=token,
            httponly=True,           # Prevent JS access
            secure=os.getenv("NODE_ENV") == "production",            # False for localhost HTTP
            samesite="lax",          # Lax for cross-origin in development
            max_age=60 * 60 * 24 * 30 ,    # 30 days
            path="/",                # Available site-wide
            #  DO NOT set domain for localhost
            # domain="127.0.0.1"
        )


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(
    user_data: RegisterRequest,
    response: Response,
    db: AsyncSession = Depends(get_async_db)
):
    """
    Register a new user and set authentication cookie
    
    - **username**: Unique username (3-50 chars)
    - **password**: Password (6-72 chars)
    - **permission**: user or admin (default: user)
    - **role**: User role (default: viewer)
    
    Returns user data and sets JWT cookie
    """
    try:
        logger.info(f"Registration attempt for username: {user_data.username}")
        
        # Register user and get token
        token, user = await AuthService.register(db, user_data)
        
        # Set authentication cookie
        set_auth_cookie(response, token)
        
        logger.info(f"User registered successfully: {user.username}")
        
        return user
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Registration error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to register user: {str(e)}"
        )



@router.post("/login")
async def login(
    credentials: LoginRequest,
    response: Response,  # ← IMPORTANT: Must have Response parameter
    db: AsyncSession = Depends(get_async_db)
):
    """Login with username and password and set authentication cookie"""
    try:
        logger.info(f"Login attempt for username: {credentials.username}")
        
        # Authenticate user and get token
        token, user = await AuthService.login(
            db,
            credentials.username,
            credentials.password
        )
        
        # ========== SET COOKIE HERE ==========
        is_production = settings.node_env == "production"
        
        response.set_cookie(
            key="jwt_auth_token",
            value=token,
            httponly=True,
            # secure=is_production,  # False for development
            secure=os.getenv("NODE_ENV") == "production",
            samesite="lax",
            max_age=60 * 60 * 24 * 30,  # 30 days
            path="/",
        )
        # ====================================
        
        logger.info(f"User logged in successfully: {user.username}")
        
        return {
            "message": "Login successful",
            "token": token,  # Also return in body for debugging
            "user": {
                "id": user.id,
                "username": user.username,
                "permission": user.permission,
                "role": user.role,
                "is_active": user.is_active
            }
        }
        
    except HTTPException as e:
        logger.warning(f"Authentication failed for user {credentials.username}: {e.detail}")
        raise
    except Exception as e:
        logger.error(f"Unexpected error during login: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )



@router.get("/me", response_model=UserResponse)
async def get_current_user_info(
    current_user: User = Depends(get_current_active_user)
):
    """
    Get current logged-in user information
    
    Requires valid JWT token (from cookie or Authorization header)
    """
    return current_user


@router.post("/logout")
async def logout(response: Response):
    """
    Logout user by clearing authentication cookie
    
    Note: JWT tokens are stateless, so logout is handled client-side
    by deleting the cookie
    """
    response.delete_cookie(
        key="jwt_auth_token",
        path="/",
        httponly=True,
        secure=settings.node_env == "production",
        samesite="lax"
    )
    
    logger.info("User logged out successfully")
    
    return {"message": "Logged out successfully"}


@router.post("/refresh")
async def refresh_token(
    response: Response,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_async_db)
):
    """
    Refresh JWT token
    
    Requires valid JWT token and returns new token
    """
    try:
        # Create new token
        new_token = AuthService.create_access_token(
            user_id=current_user.id,
            username=current_user.username,
            permission=current_user.permission,
            role=current_user.role,
            is_active=current_user.is_active
        )
        
        # Set new cookie
        set_auth_cookie(response, new_token)
        
        return {
            "message": "Token refreshed successfully",
            "user": {
                "id": current_user.id,
                "username": current_user.username,
                "permission": current_user.permission,
                "role": current_user.role
            }
        }
        
    except Exception as e:
        logger.error(f"Token refresh error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to refresh token"
        )




@router.get("/test")
async def test_auth(
    current_user: User = Depends(get_current_active_user)
):
    """
    Simple test endpoint to verify authentication
    """
    return {
        "message": " Authentication working!",
        "user": {
            "id": current_user.id,
            "username": current_user.username,
            "permission": current_user.permission,
            "role": current_user.role,
            "is_active": current_user.is_active
        }
    }


@router.get("/debug-headers")
async def debug_headers(request: Request):
    """
    Debug endpoint to see what headers/cookies are being received
    """
    return {
        "headers": dict(request.headers),
        "cookies": request.cookies,
        "query_params": dict(request.query_params),
    }