from sqlmodel import Session
from app.models import Product, OrderItem
from app.db import engine


def test_line_total_and_order_total():
    with Session(engine) as s:
        p = Product(name="TestProd", sku="TP1", price=10.0, qty_in_stock=50, slug="testprod")
        s.add(p)
        s.commit()
        s.refresh(p)

        oi = OrderItem(product_id=p.id, qty=3, unit_price=10.0, line_total=30.0)
        s.add(oi)
        s.commit()
        s.refresh(oi)

        assert oi.line_total == 30.0
