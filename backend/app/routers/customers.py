from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select
from typing import List

from ..db import get_session
from ..models import Customer

router = APIRouter(prefix="/api/customers", tags=["customers"])


@router.get("/", response_model=List[Customer])
def list_customers(
    q: str | None = Query(None),
    page: int = 1,
    page_size: int = 20,
    session: Session = Depends(get_session),
):
    offset = (page - 1) * page_size
    qsel = select(Customer)
    if q:
        term = f"%{q}%"
        qsel = qsel.where((Customer.full_name.ilike(term)) | (Customer.email.ilike(term)))
    results = session.exec(qsel.offset(offset).limit(page_size)).all()
    return results


@router.post("/", response_model=Customer)
def create_customer(payload: Customer, session: Session = Depends(get_session)):
    session.add(payload)
    session.commit()
    session.refresh(payload)
    return payload
