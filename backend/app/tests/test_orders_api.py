from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_order_stock_decrement():
    cust = {"full_name": "C1", "email": "a@b.com"}
    rc = client.post("/api/customers/", json=cust)
    assert rc.status_code == 200
    cid = rc.json().get("id")

    p = {"name": "StockProd", "sku": "SP1", "price": 2.0, "qty_in_stock": 5}
    rp = client.post("/api/products/", json=p)
    assert rp.status_code == 200
    pid = rp.json()["id"]
    slug = rp.json()["slug"]

    order_payload = {
        "customer_id": cid,
        "status": "PAID",
        "items": [{"product_id": pid, "qty": 3, "unit_price": 2.0}],
    }
    ro = client.post("/api/orders/", json=order_payload)
    assert ro.status_code == 200

    rprod = client.get(f"/p/{slug}")
    assert rprod.status_code == 200
    assert rprod.json()["qty_in_stock"] == 2
