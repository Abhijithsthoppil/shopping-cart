from fastapi import Request, HTTPException, Depends
from jose import JWTError, jwt
from app.config import settings

def get_current_user(request: Request):
    token = request.cookies.get("access_token")
    print("Token received:", token)
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=["HS256"])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token payload")
        return email
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
