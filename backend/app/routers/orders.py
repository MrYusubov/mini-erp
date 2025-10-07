from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from typing import List

from ..db import get_session
from .. import schemas, crud

router = APIRouter(prefix="/api/orders", tags=["orders"])


@router.post("/", response_model=schemas.OrderRead)
def create_order(payload: schemas.OrderCreate, session: Session = Depends(get_session)):
    try:
        with session.begin():
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
