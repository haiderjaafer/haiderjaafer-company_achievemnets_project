from sqlalchemy import Column, BigInteger, Integer, String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.database import Base


class Media(Base):
    """Media model for storing images/videos information"""
    
    __tablename__ = "Media"
    
    id = Column(BigInteger, primary_key=True, index=True)
    title = Column(String(255), nullable=False, index=True)
    description = Column(String(1000), nullable=True)
    category_id = Column(Integer, ForeignKey("Categories.id"), nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("Users.id"), nullable=False, index=True)
    media_type = Column(String(20), nullable=False, index=True)  # 'image' or 'video'
    is_active = Column(Boolean, nullable=False, default=True, index=True)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.getutcdate(), index=True)
    updated_at = Column(DateTime(timezone=True), nullable=False, server_default=func.getutcdate(), onupdate=func.getutcdate())
    updated_by = Column(Integer, ForeignKey("Users.id"), nullable=True)
    
    # ========== CORRECTED RELATIONSHIPS ==========
    
    # Relationship: Media belongs to a category
    category = relationship(
        "Category", 
        back_populates="media"
    )
    
    # Relationship: Media is created by a user
    user = relationship(
        "User", 
        back_populates="media", 
        foreign_keys=[user_id]
    )
    
    # Relationship: Media is updated by a user
    updated_user = relationship(
        "User", 
        back_populates="media_updated",  # ← CHANGED from 'media_created' to 'media_updated'
        foreign_keys=[updated_by]
    )
    
    # Relationship: Media has multiple file paths
    paths = relationship(
        "MediaPath", 
        back_populates="media", 
        cascade="all, delete-orphan"
    )
    
    def __repr__(self):
        return f"<Media(id={self.id}, title={self.title}, type={self.media_type})>"