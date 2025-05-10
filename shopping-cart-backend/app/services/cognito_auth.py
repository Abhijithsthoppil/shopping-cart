import requests
import jwt
from fastapi import HTTPException, Depends, Request
from jwt import PyJWKClient
import os
import boto3
from app.config import settings

COGNITO_REGION = os.getenv("AWS_DEFAULT_REGION")
USER_POOL_ID = os.getenv("COGNITO_USER_POOL_ID")
COGNITO_CLIENT_ID = os.getenv("COGNITO_CLIENT_ID")

jwks_url = f"https://cognito-idp.{COGNITO_REGION}.amazonaws.com/{USER_POOL_ID}/.well-known/jwks.json"
jwk_client = PyJWKClient(jwks_url)

cognito_client = boto3.client("cognito-idp", region_name=settings.AWS_DEFAULT_REGION)

def get_current_user(request: Request):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Authorization header missing or invalid")

    token = auth_header.split(" ")[1]
    try:
        signing_key = jwk_client.get_signing_key_from_jwt(token).key
        decoded = jwt.decode(
            token,
            signing_key,
            algorithms=["RS256"],
            audience=COGNITO_CLIENT_ID,
            issuer=f"https://cognito-idp.{COGNITO_REGION}.amazonaws.com/{USER_POOL_ID}"
        )
        return decoded  # contains sub, email, etc.
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Token validation error: {str(e)}")

def verify_cognito_token(token: str) -> str:
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=["HS256"])
        return payload.get("sub")
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Invalid token"
        )