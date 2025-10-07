from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List

from ..db import get_session
from .. import schemas, crud
from ..models import Product

router = APIRouter(prefix="/api/orders", tags=["orders"])


@router.post("/", response_model=schemas.OrderRead)
def create_order(payload: schemas.OrderCreate, session: Session = Depends(get_session)):
    try:
        with session.begin():
            for item in payload.items:
                product = session.get(Product, item.product_id)
                if not product:
                    raise HTTPException(
                        status_code=404,
                        detail=f"Product with id {item.product_id} not found"
                    )

                # Check if enough stock is available
                if product.qty_in_stock < item.quantity:
                    raise HTTPException(
                        status_code=400,
                        detail=f"Not enough stock for {product.name}. Available: {product.qty_in_stock}, Requested: {item.quantity}"
                    )

                # Reduce stock
                product.qty_in_stock -= item.quantity
                session.add(product)

            # Create the order
            order = crud.create_order(
                session,
                customer_id=payload.customer_id,
                status=payload.status,
                items_data=[it.dict() for it in payload.items],
            )

        return schemas.OrderRead.from_orm(order)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{order_id}", response_model=schemas.OrderRead)
def get_order(order_id: int, session: Session = Depends(get_session)):
    order = session.get(crud.Order, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


@router.get("/", response_model=List[schemas.OrderRead])
def get_all_orders(session: Session = Depends(get_session)):
    statement = select(crud.Order)
    orders = session.exec(statement).all()
    return orders