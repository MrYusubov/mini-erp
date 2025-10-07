from sqlmodel import select
from fastapi import HTTPException
from .models import Product, Customer, Order, OrderItem, OrderStatus
from .utils import generate_unique_slug
from sqlalchemy.exc import IntegrityError

def create_product(session, *, name, sku, price=0.0, qty_in_stock=0, is_active=True, slug=None):
    if not slug:
        slug = generate_unique_slug(session, name, sku)
    product = Product(name=name, sku=sku, price=price, qty_in_stock=qty_in_stock, is_active=is_active, slug=slug)
    session.add(product)
    try:
        session.commit()
    except IntegrityError as e:
        session.rollback()
        raise HTTPException(status_code=400, detail="SKU or slug already exists")
    session.refresh(product)
    return product

def list_products(session, search: str | None, ordering: str | None, offset: int, limit: int):
    q = select(Product)
    if search:
        term = f"%{search}%"
        q = q.where((Product.name.ilike(term)) | (Product.sku.ilike(term)))
    if ordering:
        desc = False
        field = ordering
        if ordering.startswith("-"):
            desc = True
            field = ordering[1:]
        if hasattr(Product, field):
            col = getattr(Product, field)
            q = q.order_by(col.desc() if desc else col)
    total = len(session.exec(select(Product)).all())
    results = session.exec(q.offset(offset).limit(limit)).all()
    return results, total

def get_product_by_id_or_slug(session, id_or_slug: str):
    # try id
    try:
        pid = int(id_or_slug)
        p = session.get(Product, pid)
        if p:
            return p
    except Exception:
        pass
    return session.exec(select(Product).where(Product.slug == id_or_slug)).first()

from .models import OrderItem

def create_order(session, customer_id: int, status, items_data: list):
    from .models import Product
    # Validate customer exists
    customer = session.get(Customer, customer_id)
    if not customer:
        raise HTTPException(status_code=404, detail=f"Customer {customer_id} not found")

    items = []
    total = 0.0
    for it in items_data:
        product = session.get(Product, it["product_id"]) if isinstance(it["product_id"], int) else None
        if not product:
            raise HTTPException(status_code=404, detail=f"Product {it['product_id']} not found")
        if it["qty"] <= 0:
            raise HTTPException(status_code=400, detail="qty must be > 0")
        if it["unit_price"] < 0:
            raise HTTPException(status_code=400, detail="unit_price must be >= 0")
        line_total = it["qty"] * it["unit_price"]
        items.append(OrderItem(product_id=product.id, qty=it["qty"], unit_price=it["unit_price"], line_total=line_total))
        total += line_total

    order = Order(customer_id=customer_id, status=status, total=total)
    session.add(order)
    session.flush()  # assign order.id
    for it in items:
        it.order_id = order.id
        session.add(it)

    if status == OrderStatus.PAID:
        # decrement stock atomically inside same transaction
        for it in items:
            product = session.get(Product, it.product_id)
            if product.qty_in_stock < it.qty:
                raise HTTPException(status_code=400, detail=f"Not enough stock for product {product.id}")
            product.qty_in_stock -= it.qty
            session.add(product)

    session.commit()
    session.refresh(order)
    return order