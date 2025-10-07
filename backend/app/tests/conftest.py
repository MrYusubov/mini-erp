import pytest
from sqlmodel import SQLModel, create_engine, Session
from fastapi.testclient import TestClient
import os

from app.main import app

TEST_DB_URL = "sqlite:///./test_mini_erp.db"
engine = create_engine(TEST_DB_URL, connect_args={"check_same_thread": False})


@pytest.fixture(scope="session", autouse=True)
def create_test_db():
    SQLModel.metadata.create_all(engine)
    yield
    try:
        os.remove("test_mini_erp.db")
    except Exception:
        pass


@pytest.fixture()
def client():
    return TestClient(app)


@pytest.fixture()
def session():
    with Session(engine) as s:
        yield s
