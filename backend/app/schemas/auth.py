from pydantic import BaseModel, Field, field_validator
from typing import Optional


class Token(BaseModel):
    """Token response schema"""
    access_token: str
    token_type: str = "bearer"
    user_id: int
    username: str
    permission: str
    role: str


class TokenData(BaseModel):
    """Token payload schema"""
    user_id: Optional[int] = None
    username: Optional[str] = None


class LoginRequest(BaseModel):
    """Login request schema"""
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=6, max_length=72)
    
    @field_validator('password')
    @classmethod
    def validate_password_length(cls, v: str) -> str:
        """Ensure password doesn't exceed bcrypt's 72 byte limit"""
        if len(v.encode('utf-8')) > 72:
            raise ValueError('Password is too long (max 72 bytes in UTF-8)')
        return v


class RegisterRequest(BaseModel):
    """Registration request schema"""
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(
        ..., 
        min_length=6, 
        max_length=72,
        description="Password must be between 6-72 characters"
    )
    permission: str = Field(default="user", pattern="^(user|admin)$")
    role: str = Field(default="viewer", max_length=20)
    
    @field_validator('username')
    @classmethod
    def validate_username(cls, v: str) -> str:
        """Validate username format"""
        if not v.strip():
            raise ValueError('Username cannot be empty or whitespace only')
        if not v.replace('_', '').replace('-', '').isalnum():
            raise ValueError('Username can only contain letters, numbers, underscores and hyphens')
        return v.strip().lower()
    
    @field_validator('password')
    @classmethod
    def validate_password(cls, v: str) -> str:
        """Validate password strength and length"""
        if len(v.encode('utf-8')) > 72:
            raise ValueError('Password is too long (max 72 bytes in UTF-8)')
        
        # Optional: Add password strength requirements
        if len(v) < 6:
            raise ValueError('Password must be at least 6 characters long')
        
        return v


class ChangePasswordRequest(BaseModel):
    """Change password request schema"""
    old_password: str = Field(..., min_length=6, max_length=72)
    new_password: str = Field(
        ..., 
        min_length=6, 
        max_length=72,
        description="New password must be between 6-72 characters"
    )
    
    @field_validator('new_password')
    @classmethod
    def validate_new_password(cls, v: str) -> str:
        """Validate new password"""
        if len(v.encode('utf-8')) > 72:
            raise ValueError('Password is too long (max 72 bytes in UTF-8)')
        return v
    
    @field_validator('new_password')
    @classmethod
    def passwords_must_differ(cls, v: str, info) -> str:
        """Ensure new password is different from old password"""
        if 'old_password' in info.data and v == info.data['old_password']:
            raise ValueError('New password must be different from old password')
        return v