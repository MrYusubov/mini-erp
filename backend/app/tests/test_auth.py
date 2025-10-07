from fastapi.testclient import TestClient
from app.main import app
from sqlmodel import Session
from app.db import engine
from app.models import User
from app.security import get_password_hash

client = TestClient(app)

def setup_user():
    with Session(engine) as s:
        u = User(email="admin@test.local", full_name="Admin", hashed_password=get_password_hash("admin123"), is_superuser=True)
        s.add(u)
        s.commit()

def test_login_and_access_admin_endpoint():
    setup_user()

    data = {"username": "admin@test.local", "password": "admin123"}
    r = client.post("/api/auth/token", data=data)  # form data
    assert r.status_code == 200
    token = r.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    payload = {"name":"A","sku":"A101","price":1.0,"qty_in_stock":10}
    r2 = client.post("/api/products/", json=payload, headers=headers)
    assert r2.status_code == 200
