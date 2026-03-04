from fastapi import FastAPI, Depends, HTTPException  # type: ignore
from fastapi.security import OAuth2PasswordRequestForm #type: ignore
from sqlalchemy.orm import Session # type: ignore
from .database import engine, SessionLocal, get_db
from . import models, schemas
from fastapi.middleware.cors import CORSMiddleware #type: ignore

from .auth import hash_password, verify_password, create_access_token, get_current_user
from .models import User

import os

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = os.getenv("ALLOW_ORIGINS", "")
origins = origins.split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/tasks", response_model=schemas.TaskResponse)
def create_task(task: schemas.TaskCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    new_task = models.Task(title=task.title, user_id=current_user.id)
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task

@app.get("/tasks", response_model = list[schemas.TaskResponse])
def get_task(db: Session = Depends(get_db), current_user: User=Depends(get_current_user)):
    return db.query(models.Task).filter(models.Task.user_id == current_user.id).all() 

@app.delete("/tasks/{task_id}")
def delete_task(task_id: int, db:Session = Depends(get_db),current_user: User=Depends(get_current_user)):
    task = db.query(models.Task).filter(models.Task.id == task_id, models.Task.user_id == current_user.id).first()

    if not task:
        raise HTTPException(status_code = 404, detail="Task not found")
    
    db.delete(task)
    db.commit()
    return {"message":"Task deleted"}

@app.put("/tasks/{task_id}", response_model = schemas.TaskResponse)
def update_task(task_id: int, db: Session = Depends(get_db),current_user: User=Depends(get_current_user)):
    task = db.query(models.Task).filter(models.Task.id == task_id,models.Task.user_id == current_user.id).first()

    if not task:
        raise HTTPException(status_code = 404, detail="Task not found")
    
    task.completed = not task.completed
    db.commit()
    db.refresh(task)
    return task


@app.post("/register")
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):

    existing_user = db.query(User).filter(
        User.username == user.username
    ).first()

    if existing_user:
        raise HTTPException(status_code = 400, detail="Username already exists")

    hashed_password = hash_password(user.password)

    db_user= User(username=user.username, password = hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return {"message":"User created successfully"}

@app.post("/login")
def login(form_data: OAuth2PasswordRequestForm=Depends(), db: Session= Depends(get_db)):

    db_user = db.query(User).filter(
        User.username == form_data.username
    ).first()

    if not db_user:
        raise HTTPException(status_code = 400, detail="Invalid credentials")
    
    if not verify_password(form_data.password, db_user.password):
        raise HTTPException(status_code = 400, detail="Invalid credentials")
    
    access_token = create_access_token(
        data={"sub":db_user.username}
    )

    return {
        "access_token": access_token,
        "token_type":"bearer"
    }
