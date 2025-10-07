import os
from sqlmodel import SQLModel, create_engine,Session
from sqlalchemy.orm import sessionmaker
from typing import Generator

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./mini_erp.db")
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session
