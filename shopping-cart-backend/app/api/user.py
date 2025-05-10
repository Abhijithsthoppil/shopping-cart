from fastapi import APIRouter, Depends
from app.dependencies.auth import get_current_user

user_router = APIRouter()

@user_router.get("/me")
def get_me(user=Depends(get_current_user)):
    return {"user": user}
