from pydantic import BaseModel, Field #type: ignore

class TaskCreate(BaseModel):
    title: str = Field(min_length=1, max_length=255)

class TaskResponse(BaseModel):
    id: int
    title: str
    completed: bool

    model_config = {
        "from_attributes":True
    }

class UserCreate(BaseModel):
    username: str  = Field(min_length=3, max_length=50)
    password: str  = Field(min_length=6)

class UserLogin(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    id: int
    username: str

    model_config = {
        "from_attributes":True
    }
