from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.database import Base


class Category(Base):
    __tablename__ = "Categories"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    category_name = Column(String(100), nullable=False, unique=True, index=True)
    description = Column(String(500), nullable=True)
    icon = Column(String(50), nullable=True)
    color_code = Column(String(7), nullable=True)
    sort_order = Column(Integer, nullable=True, default=0)
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime, nullable=False, default=func.getutcdate())
    created_by = Column(Integer, ForeignKey("Users.id"), nullable=False)
    updated_at = Column(DateTime, nullable=False, default=func.getutcdate(), onupdate=func.getutcdate())
    
    # Relationships
    creator = relationship(
        "User", 
        back_populates="categories", 
        foreign_keys=[created_by]
    )
    
    # ========== ADD THIS RELATIONSHIP ==========
    media = relationship(
        "Media", 
        back_populates="category"
    )