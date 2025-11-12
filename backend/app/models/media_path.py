from sqlalchemy import Column, BigInteger, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.database import Base


class MediaPath(Base):
    """MediaPath model for storing actual file paths and metadata"""
    
    __tablename__ = "MediaPaths"
    
    id = Column(BigInteger, primary_key=True, index=True)
    media_id = Column(BigInteger, ForeignKey("Media.id", ondelete="CASCADE"), nullable=False, index=True)
    file_path = Column(String(None), nullable=False)  # String(None) = String(max) in SQL Server
    file_name = Column(String(255), nullable=False)
    file_size = Column(BigInteger, nullable=False)  # Size in bytes
    file_extension = Column(String(10), nullable=False, index=True)  # 'jpg', 'png', 'mp4'
    mime_type = Column(String(100), nullable=True)  # 'image/jpeg', 'video/mp4'
    is_primary = Column(Boolean, nullable=False, default=False, index=True)
    sort_order = Column(Integer, nullable=False, default=0)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.getutcdate())
    created_by = Column(Integer, ForeignKey("Users.id"), nullable=False)
    
    # Relationships
    media = relationship(
        "Media", 
        back_populates="paths"
    )
    
    created_user = relationship(
        "User", 
        back_populates="media_paths"
    )
    
    def __repr__(self):
        return f"<MediaPath(id={self.id}, media_id={self.media_id}, file_name={self.file_name})>"