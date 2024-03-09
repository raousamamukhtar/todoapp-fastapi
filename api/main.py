# main.py
from fastapi import FastAPI, HTTPException
from sqlmodel import Session
import os
from dotenv import load_dotenv
from sqlmodel import select
from typing import Optional
from sqlmodel import Field, SQLModel
from sqlmodel import create_engine, SQLModel
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from sqlalchemy import create_engine,text
import os

load_dotenv()

key = os.getenv("db-key")
baseurl = os.getenv("url")
conn_str = f'{key}'
engine = create_engine(conn_str)



app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[baseurl],  # Adjust this to your frontend's address
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



def create_db_and_tables():
    SQLModel.metadata.create_all(engine)



class TodoItem(SQLModel, table=True):
    id: Optional[int] = Field(primary_key=True)
    title: str
    description: Optional[str] = None
    completed: bool = False

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

@app.post("/todos/", response_model=TodoItem)
def create_todo(todo: TodoItem):
    with Session(engine) as session:
        session.add(todo)
        session.commit()
        session.refresh(todo)
        return todo

@app.get("/todos/", response_model=list[TodoItem])
def read_todos():
    with Session(engine) as session:
        return session.exec(select(TodoItem)).all()

@app.put("/todos/{todo_id}", response_model=TodoItem)
def update_todo(todo_id: int, todo: TodoItem):
    with Session(engine) as session:
        db_todo = session.get(TodoItem, todo_id)
        if not db_todo:
            raise HTTPException(status_code=404, detail="Todo not found")
        todo_data = todo.dict(exclude_unset=True)
        for key, value in todo_data.items():
            setattr(db_todo, key, value)
        session.add(db_todo)
        session.commit()
        session.refresh(db_todo)
        return db_todo
    
@app.delete("/todos/{todo_id}", response_model=TodoItem)
def delete_todo(todo_id: int):
    with Session(engine) as session:
        db_todo = session.get(TodoItem, todo_id)
        if not db_todo:
            raise HTTPException(status_code=404, detail="Todo not found")
        session.delete(db_todo)
        session.commit()
        return db_todo
