from app.models.users import User
from app.models.categories import Category
from app.models.media import Media
from app.models.media_path import MediaPath

# This ensures all models are imported and SQLAlchemy can build relationships
__all__ = ["User", "Category", "Media", "MediaPath"]