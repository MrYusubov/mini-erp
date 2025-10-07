from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_create_and_get_product():
    payload = {"name": "API Prod", "sku": "AP1", "price": 5.5, "qty_in_stock": 10}
    r = client.post("/api/products/", json=payload)
    assert r.status_code == 200
    data = r.json()
    assert data["sku"] == "AP1"

    # get list
    r2 = client.get("/api/products/?search=API")
    assert r2.status_code == 200
    products = r2.json()
    assert isinstance(products, list)
    assert any(p["sku"] == "AP1" for p in products)

