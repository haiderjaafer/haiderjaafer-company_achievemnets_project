from pydantic import BaseModel, Field, ConfigDict, field_validator
from datetime import datetime
from typing import Optional


class UserBase(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    permission: str = Field(default="user", pattern="^(user|admin)$")
    role: str = Field(default="viewer", max_length=20)
    is_active: bool = Field(default=True)


class UserCreate(UserBase):
    password: str = Field(..., min_length=6, max_length=72)
    
    @field_validator('password')
    @classmethod
    def validate_password(cls, v: str) -> str:
        """Validate password length for bcrypt"""
        if len(v.encode('utf-8')) > 72:
            raise ValueError('Password is too long (max 72 bytes in UTF-8)')
        return v


class UserUpdate(BaseModel):
    username: Optional[str] = Field(None, min_length=3, max_length=50)
    password: Optional[str] = Field(None, min_length=6, max_length=72)
    permission: Optional[str] = Field(None, pattern="^(user|admin)$")
    role: Optional[str] = Field(None, max_length=20)
    is_active: Optional[bool] = None
    
    @field_validator('password')
    @classmethod
    def validate_password(cls, v: Optional[str]) -> Optional[str]:
        """Validate password length for bcrypt"""
        if v and len(v.encode('utf-8')) > 72:
            raise ValueError('Password is too long (max 72 bytes in UTF-8)')
        return v


class UserResponse(UserBase):
    id: int
    last_login: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


class UserLogin(BaseModel):
    username: str
    password: str = Field(..., max_length=72)