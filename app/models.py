from sqlalchemy import Column, Integer, String, Boolean, ForeignKey #type: ignore
from sqlalchemy.orm import relationship #type: ignore
from .database import Base

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key = True, index = True)
    title = Column(String, nullable = False)
    completed = Column(Boolean, default = False)

    user_id = Column(Integer, ForeignKey("users.id"),nullable = False)
    owner = relationship("User", back_populates = "tasks")

class User(Base):
     __tablename__ = "users" 
     id = Column(Integer, primary_key = True, index = True) 
     username = Column(String, unique=True, index=True) 
     password = Column(String, nullable=False)

     tasks = relationship("Task", back_populates="owner",cascade="all, delete")