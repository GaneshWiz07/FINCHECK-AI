from fastapi import APIRouter, HTTPException, Header, Depends
from pydantic import BaseModel
from typing import Optional
from config import supabase
from auth_middleware import get_current_user

router = APIRouter()

class ProfileUpdate(BaseModel):
    business_name: Optional[str] = None
    industry: Optional[str] = None
    annual_revenue: Optional[str] = None
    language: Optional[str] = None

@router.get("/me")
async def get_profile(current_user = Depends(get_current_user)):
    try:
        user_id = current_user.id
        response = supabase.table("profiles").select("*").eq("id", user_id).single().execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=404, detail="Profile not found")

@router.put("/me")
async def update_profile(profile: ProfileUpdate, current_user = Depends(get_current_user)):
    try:
        user_id = current_user.id
        update_data = {k: v for k, v in profile.dict().items() if v is not None}
        response = supabase.table("profiles").update(update_data).eq("id", user_id).execute()
        return {"message": "Profile updated successfully", "data": response.data}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
