#  Import FastAPI core
from fastapi import FastAPI

#  CORS middleware to allow frontend (like React on localhost:3000) to access the API
from fastapi.middleware.cors import CORSMiddleware

#  Context manager to define startup/shutdown behavior
from contextlib import asynccontextmanager

#  SQLAlchemy engine and base (used to create tables)
from app.database.database import engine, Base

#  Custom app settings from .env or config file
from app.database.config import settings

from app.routes import auth, users

from app.routes import auth, users, media_upload,categories,media

import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

# Log JWT secret on startup (REMOVE IN PRODUCTION!)
print("=" * 50)
print(f"🔑 Backend JWT_SECRET length: {len(settings.jwt_secret)}")
print(f"🔑 Backend JWT_SECRET first 10 chars: {settings.jwt_secret[:10]}")
print(f"🔑 Backend JWT_SECRET: {settings.jwt_secret}")  # REMOVE IN PRODUCTION!
print("=" * 50)


#  Import your route modules
# from app.routes.committees import committeesRouter
# # from app.routes.authentication import router
# from app.routes.authentication import router

# from app.routes.employees import employeesRouter  




@asynccontextmanager
async def lifespan(app: FastAPI):
    if settings.MODE.upper() == "DEVELOPMENT":  # Ensures dev mode is case-insensitive // READ MODE from .env file
        print("🌱 DEVELOPMENT mode: creating database tables...")
        
        # Fixed: Use async method for table creation
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
    else:
        print("🚀 PRODUCTION Mode: Skipping Table Creation.")
        print(f"{app.title}...")

    yield  #  Allows the application to continue startup


def create_app() -> FastAPI:              #create_app() just defines a factory function returning a FastAPI app.

    app = FastAPI(
        title="Company Achievements API PROJECT",         # Shown in docs
        version="1.0.0",
        docs_url="/api/docs",             # Swagger UI
        redoc_url="/api/redoc",           # ReDoc UI
        lifespan=lifespan                 # Hook startup logic
    )

    #  Enable CORS for frontend (e.g., Next.js or React app on port 3000)
# ========== CRITICAL: CORS Configuration for Cookies ==========
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[
            "http://localhost:3000",      # Frontend URL
            # "http://127.0.0.1:3000",      # Alternative localhost
        ],
        allow_credentials=True,           # ← MUST be True for cookies
        allow_methods=["*"],
        allow_headers=["*"],
        expose_headers=["Set-Cookie"],    # ← Expose Set-Cookie header
    )

    #  Register routers
    app.include_router(auth.router)
    app.include_router(users.router)
    app.include_router(media_upload.router)
    app.include_router(categories.router)
    app.include_router(media.router)  




    return app


app = create_app()