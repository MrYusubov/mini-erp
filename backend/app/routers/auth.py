from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from sqlalchemy import select
from typing import Any
from ..deps import get_current_user

from ..db import get_session
from ..models import User
from ..schemas import UserCreate, UserRead
from ..security import verify_password, get_password_hash, create_access_token
from pydantic import BaseModel

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/token")
def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    session: Session = Depends(get_session)
):
    user = session.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")

    token = create_access_token({"sub": user.email, "is_superuser": user.is_superuser})
    return {"access_token": token, "token_type": "bearer"}


class LoginRequest(BaseModel):
    email: str
    password: str


@router.post("/login")
def login(payload: LoginRequest, session: Session = Depends(get_session)) -> Any:
    user = session.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")

    token = create_access_token({"sub": user.email, "is_superuser": user.is_superuser})
    return {"access_token": token, "token_type": "bearer"}


@router.post("/register", response_model=UserRead)
def register_user(payload: UserCreate, session: Session = Depends(get_session)):
    user_exists = session.query(User).filter(User.email == payload.email).first()
    if user_exists:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_pw = get_password_hash(payload.password)

    new_user = User(
        email=payload.email,
        full_name=payload.full_name,
        hashed_password=hashed_pw,
        is_superuser=False
    )
    session.add(new_user)
    session.commit()
    session.refresh(new_user)
    return new_user


@router.get("/me", response_model=UserRead)
def read_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.post("/admin/login")
def admin_login(payload: LoginRequest, session: Session = Depends(get_session)):
    user = session.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")

    if not user.is_superuser:
        raise HTTPException(status_code=403, detail="Not authorized as admin")

    token = create_access_token({"sub": user.email, "is_superuser": True})
    return {"access_token": token, "token_type": "bearer"}
