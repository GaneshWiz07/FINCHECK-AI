# Authentication has been removed
# This file is kept for compatibility but all endpoints return mock data

from fastapi import APIRouter

router = APIRouter()

@router.get("/user")
async def get_current_user():
    """Return mock user since authentication is disabled"""
    return {
        "user_id": "demo-user-001",
        "email": "demo@fincheck.ai",
        "user_metadata": {
            "business_name": "Demo Business",
            "industry": "technology",
            "annual_revenue": "1Cr-5Cr",
            "language": "en"
        }
    }
