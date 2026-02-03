from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, Response
from contextlib import asynccontextmanager
import uvicorn
import os
from pathlib import Path

from routes.auth import router as auth_router
from routes.profile import router as profile_router
from routes.upload import router as upload_router
from routes.analysis import router as analysis_router
from routes.insights import router as insights_router
from routes.benchmarks import router as benchmarks_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("FINCHECK AI Backend Starting...")
    yield
    print("FINCHECK AI Backend Shutting Down...")

app = FastAPI(
    title="FINCHECK AI",
    description="Financial Health Assessment Tool for SMEs",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration
frontend_url = os.environ.get("FRONTEND_URL", "")
allowed_origins = [origin.strip() for origin in frontend_url.split(",") if origin.strip()]
allowed_origins.extend([
    "http://localhost:5173",
    "http://localhost:5000", 
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5000",
    "http://localhost:3000"
])

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins if allowed_origins else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API routes
app.include_router(auth_router, prefix="/api/auth", tags=["Authentication"])
app.include_router(profile_router, prefix="/api/profile", tags=["Profile"])
app.include_router(upload_router, prefix="/api/upload", tags=["File Upload"])
app.include_router(analysis_router, prefix="/api/analysis", tags=["Financial Analysis"])
app.include_router(insights_router, prefix="/api/insights", tags=["AI Insights"])
app.include_router(benchmarks_router, prefix="/api/benchmarks", tags=["Industry Benchmarks"])

@app.get("/api/health")
@app.head("/api/health")
async def health_check():
    return {"status": "healthy", "service": "FINCHECK AI"}

# Serve static files in production
# The frontend build output will be in ../dist/public
STATIC_DIR = Path(__file__).parent.parent / "dist" / "public"

if STATIC_DIR.exists():
    print(f"Serving static files from {STATIC_DIR}")
    
    # Mount static assets (js, css, images)
    assets_dir = STATIC_DIR / "assets"
    if assets_dir.exists():
        app.mount("/assets", StaticFiles(directory=str(assets_dir)), name="assets")
    
    # Root route - serve index.html for both GET and HEAD
    @app.get("/")
    async def serve_root():
        return FileResponse(str(STATIC_DIR / "index.html"))
    
    @app.head("/")
    async def head_root():
        return Response(status_code=200)
    
    # Catch-all route for SPA - must be last
    @app.get("/{full_path:path}")
    async def serve_spa(request: Request, full_path: str):
        # Don't serve index.html for API routes
        if full_path.startswith("api/"):
            return {"error": "Not found"}
        
        # Check if it's a static file request
        static_file = STATIC_DIR / full_path
        if static_file.exists() and static_file.is_file():
            return FileResponse(str(static_file))
        
        # Serve index.html for all other routes (SPA routing)
        index_path = STATIC_DIR / "index.html"
        if index_path.exists():
            return FileResponse(str(index_path))
        return {"error": "Frontend not built"}
    
    @app.head("/{full_path:path}")
    async def head_spa(full_path: str):
        return Response(status_code=200)
else:
    print(f"Static files not found at {STATIC_DIR} - running in development mode")
    
    @app.get("/")
    @app.head("/")
    async def root():
        return {
            "message": "FINCHECK AI API",
            "docs": "/docs",
            "health": "/api/health"
        }

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
