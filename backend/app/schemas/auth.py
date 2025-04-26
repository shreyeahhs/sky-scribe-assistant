from pydantic import BaseModel
from typing import Optional
from app.models.user import UserRole

# Mock user data
MOCK_USERS = {
    "admin@example.com": {
        "id": 1,
        "email": "admin@example.com",
        "password": "admin123",
        "full_name": "Admin User",
        "role": UserRole.ADMIN,
        "is_active": True
    },
    "user@example.com": {
        "id": 2,
        "email": "user@example.com",
        "password": "user123",
        "full_name": "Regular User",
        "role": UserRole.USER,
        "is_active": True
    }
}

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[UserRole] = None

class UserBase(BaseModel):
    email: str
    full_name: Optional[str] = None

class UserCreate(UserBase):
    password: str
    role: UserRole = UserRole.USER

class UserResponse(UserBase):
    id: int
    role: UserRole
    is_active: bool

    class Config:
        from_attributes = True 