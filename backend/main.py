from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import uvicorn

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

import os
allowed_origins = os.environ.get("REPLIT_DEV_DOMAIN", "").split(",")
allowed_origins = [f"https://{origin.strip()}" for origin in allowed_origins if origin.strip()]
allowed_origins.append("http://localhost:5000")
allowed_origins.append("http://127.0.0.1:5000")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins if allowed_origins else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api/auth", tags=["Authentication"])
app.include_router(profile_router, prefix="/api/profile", tags=["Profile"])
app.include_router(upload_router, prefix="/api/upload", tags=["File Upload"])
app.include_router(analysis_router, prefix="/api/analysis", tags=["Financial Analysis"])
app.include_router(insights_router, prefix="/api/insights", tags=["AI Insights"])
app.include_router(benchmarks_router, prefix="/api/benchmarks", tags=["Industry Benchmarks"])

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "service": "FINCHECK AI"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
