from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from config import supabase

router = APIRouter()

class SignUpRequest(BaseModel):
    email: EmailStr
    password: str
    business_name: str
    industry: str
    annual_revenue: str
    language: str = "en"

class SignInRequest(BaseModel):
    email: EmailStr
    password: str

class AuthResponse(BaseModel):
    user_id: str
    email: str
    access_token: str
    message: str

@router.post("/signup")
async def sign_up(request: SignUpRequest):
    try:
        auth_response = supabase.auth.sign_up({
            "email": request.email,
            "password": request.password,
            "options": {
                "data": {
                    "business_name": request.business_name,
                    "industry": request.industry,
                    "annual_revenue": request.annual_revenue,
                    "language": request.language
                }
            }
        })
        
        if auth_response.user is None:
            raise HTTPException(status_code=400, detail="Failed to create account")
        
        profile_data = {
            "id": auth_response.user.id,
            "email": request.email,
            "business_name": request.business_name,
            "industry": request.industry,
            "annual_revenue": request.annual_revenue,
            "language": request.language
        }
        
        supabase.table("profiles").upsert(profile_data).execute()
        
        return {
            "user_id": auth_response.user.id,
            "email": request.email,
            "message": "Account created successfully. Please check your email to verify."
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/signin")
async def sign_in(request: SignInRequest):
    try:
        auth_response = supabase.auth.sign_in_with_password({
            "email": request.email,
            "password": request.password
        })
        
        if auth_response.user is None:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        return {
            "user_id": auth_response.user.id,
            "email": auth_response.user.email,
            "access_token": auth_response.session.access_token,
            "message": "Signed in successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))

@router.post("/signout")
async def sign_out():
    try:
        supabase.auth.sign_out()
        return {"message": "Signed out successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/user")
async def get_current_user(authorization: str = None):
    try:
        if not authorization:
            raise HTTPException(status_code=401, detail="No authorization token")
        
        token = authorization.replace("Bearer ", "")
        user = supabase.auth.get_user(token)
        
        if user.user is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        return {
            "user_id": user.user.id,
            "email": user.user.email,
            "user_metadata": user.user.user_metadata
        }
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))
