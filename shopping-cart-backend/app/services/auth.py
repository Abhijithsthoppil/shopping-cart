import jwt
from datetime import datetime, timedelta
from app.config import settings
from app.models.user import get_user_by_username

def verify_password(input_password: str, stored_password: str) -> bool:
    return input_password == stored_password

def authenticate_user(username: str, password: str):
    user = get_user_by_username(username)
    if user and verify_password(password, user['hashed_password']):
        return user
    return None

def create_access_token(data: dict, expires_delta: timedelta = timedelta(minutes=30)):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.JWT_SECRET, algorithm="HS256")
