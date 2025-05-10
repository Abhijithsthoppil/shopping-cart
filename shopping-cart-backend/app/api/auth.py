from fastapi import APIRouter, HTTPException, Response
from pydantic import BaseModel, EmailStr
from datetime import datetime
from app.security import get_password_hash, verify_password, create_access_token
from app.services.dynamo_client import get_users_table

auth_router = APIRouter()
table = get_users_table()

class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

@auth_router.post("/signup")
def signup(user: UserCreate, response: Response):
    existing = table.get_item(Key={"email": user.email})
    if "Item" in existing:
        raise HTTPException(status_code=400, detail="User already exists")

    password_hash = get_password_hash(user.password)
    table.put_item(Item={
        "email": user.email,
        "password_hash": password_hash,
        "created_at": datetime.utcnow().isoformat()
    })

    token = create_access_token({"sub": user.email})

    response.set_cookie(
        key="access_token", 
        value=token, 
        httponly=True,   # Prevent JavaScript access to the cookie
        secure=False,     # Only send cookie over HTTPS
        samesite="Lax", # Prevent CSRF attacks
        max_age=3600     # Set cookie expiration time (1 hour)
    )

    return {"message": "Signup successful"}

@auth_router.post("/login")
def login(user: UserLogin, response: Response):
    record = table.get_item(Key={"email": user.email})
    item = record.get("Item")
    if not item or not verify_password(user.password, item["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": user.email})

    response.set_cookie(
        key="access_token", 
        value=token, 
        httponly=True,
        secure=False,     # Only send cookie over HTTPS
        samesite="Lax", # Prevent CSRF attacks
        max_age=3600     # Set cookie expiration time (1 hour)
    )

    return {"message": "Login successful"}
    
@auth_router.post("/logout")
def logout(response: Response):
    response.delete_cookie("access_token")
    return {"message": "Logout successful"}
