from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta
from typing import Any

from app.core.security import create_access_token, oauth2_scheme
from app.core.config import settings
from app.schemas.auth import Token, UserCreate, UserResponse, MOCK_USERS

router = APIRouter()

@router.post("/register", response_model=UserResponse)
async def register(user: UserCreate) -> Any:
    if user.email in MOCK_USERS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # For mock purposes, we'll just return a success response
    return UserResponse(
        id=len(MOCK_USERS) + 1,
        email=user.email,
        full_name=user.full_name,
        role=user.role,
        is_active=True
    )

@router.post("/token", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    user = MOCK_USERS.get(form_data.username)
    if not user or user["password"] != form_data.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["email"], "role": user["role"]},
        expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"} 