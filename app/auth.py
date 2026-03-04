from passlib.context import CryptContext #type: ignore
from jose import JWTError, jwt #type: ignore
from datetime import datetime, timedelta

from fastapi import Depends, HTTPException #type: ignore
from fastapi.security import OAuth2PasswordBearer # type: ignore
from sqlalchemy.orm import Session # type: ignore
from .database import SessionLocal,get_db
from .models import User

import os

oauth2_scheme = OAuth2PasswordBearer(tokenUrl = "login")

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

if not SECRET_KEY:
    raise ValueError("SECRET_KEY enviroment variable not set")

def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(plain_password,hashed_password):
    return pwd_context.verify(plain_password,hashed_password)

def create_access_token(data: dict):
    to_encode=data.copy()
    expire= datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp":expire,"sub": data.get("sub")})
    if "sub" not in data:
        raise ValueError("Token data must include 'sub'") 
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(
        token: str = Depends(oauth2_scheme),
        db: Session = Depends(get_db)
):
    try:
        payload = jwt.decode(token, SECRET_KEY,algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code = 401, detail="Invalid token",headers={"WWW-Authenticate": "Bearer"},)
    except JWTError:
        raise HTTPException(status_code = 401, detail= "Invalid token",headers={"WWW-Authenticate": "Bearer"},)
    
    user = db.query(User).filter(User.username == username).first()

    if user is None:
        raise HTTPException(status_code = 401, detail = "User not found")
    return user