from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

# Mock profile data - no database required
mock_profile = {
    "id": "demo-user-001",
    "email": "demo@fincheck.ai",
    "business_name": "Demo Business",
    "industry": "technology",
    "annual_revenue": "1Cr-5Cr",
    "language": "en"
}

class ProfileUpdate(BaseModel):
    business_name: Optional[str] = None
    industry: Optional[str] = None
    annual_revenue: Optional[str] = None
    language: Optional[str] = None

@router.get("/me")
async def get_profile():
    """Return mock profile - no authentication required"""
    return mock_profile

@router.put("/me")
async def update_profile(profile: ProfileUpdate):
    """Update mock profile in memory"""
    global mock_profile
    update_data = {k: v for k, v in profile.dict().items() if v is not None}
    mock_profile.update(update_data)
    return {"message": "Profile updated successfully", "data": mock_profile}
