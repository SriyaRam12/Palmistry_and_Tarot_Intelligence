from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.schemas.user import UserLogin, Token, UserCreate, UserResponse
from app.services.user_service import authenticate_user, create_user
from app.core.security import create_access_token
from app.database.connection import get_db
from app.core.dependencies import get_current_user
router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

@router.post("/register", response_model=UserResponse)
def register(
    user: UserCreate,
    db: Session = Depends(get_db)
):
    try:
        return create_user(db, user)
    except Exception as e:
        print("REGISTER ERROR:", repr(e))
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

@router.post("/login", response_model=Token)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = authenticate_user(
        db,
        form_data.username,   # Swagger sends email in the username field
        form_data.password
    )

    if user is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    token = create_access_token(
        {
            "sub": user.email,
            "role": user.role
        }
    )

    return {
        "access_token": token,
        "token_type": "bearer"
    }


@router.get("/me")
def get_me(current_user=Depends(get_current_user)):
    return current_user