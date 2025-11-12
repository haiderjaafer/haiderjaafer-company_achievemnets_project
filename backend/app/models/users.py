from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.database import Base


class User(Base):
    __tablename__ = "Users"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    username = Column(String(50), nullable=False, unique=True, index=True)
    password = Column(Text, nullable=False)  # Store hashed password
    permission = Column(String(10), nullable=False, default="user")
    role = Column(String(20), nullable=False, default="viewer")
    is_active = Column(Boolean, nullable=False, default=True)
    last_login = Column(DateTime, nullable=True)
    created_at = Column(DateTime, nullable=False, default=func.getutcdate())
    updated_at = Column(DateTime, nullable=False, default=func.getutcdate(), onupdate=func.getutcdate())
    
    # ========== ADD THESE RELATIONSHIPS ==========
    
    # Relationship: User creates categories
    categories = relationship(
        "Category", 
        back_populates="creator", 
        foreign_keys="Category.created_by"
    )
    
    # Relationship: User creates media (as owner)
    media = relationship(
        "Media", 
        back_populates="user", 
        foreign_keys="Media.user_id"
    )
    
    # Relationship: User updates media (as updater)
    media_updated = relationship(
        "Media", 
        back_populates="updated_user", 
        foreign_keys="Media.updated_by"
    )
    
    # Relationship: User creates media paths
    media_paths = relationship(
        "MediaPath", 
        back_populates="created_user",
        foreign_keys="MediaPath.created_by"
    )