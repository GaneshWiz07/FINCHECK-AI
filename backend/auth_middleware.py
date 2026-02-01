from fastapi import HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from config import supabase

security = HTTPBearer(auto_error=False)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if credentials is None:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    try:
        token = credentials.credentials
        user = supabase.auth.get_user(token)
        
        if user.user is None:
            raise HTTPException(status_code=401, detail="Invalid or expired token")
        
        return user.user
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Authentication failed: {str(e)}")

async def get_optional_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if credentials is None:
        return None
    
    try:
        token = credentials.credentials
        user = supabase.auth.get_user(token)
        return user.user if user.user else None
    except:
        return None
