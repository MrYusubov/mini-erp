from fastapi import APIRouter, Depends, UploadFile, File, Query, HTTPException
from sqlmodel import Session, select
from typing import List
import pandas as pd
from fastapi.responses import StreamingResponse
from io import BytesIO, StringIO

from ..db import get_session
from .. import crud, schemas, models

from ..deps import get_current_admin
from ..models import User

router = APIRouter(prefix="/api/products", tags=["products"])


@router.get("/", response_model=List[schemas.ProductRead])
def read_products(
    search: str | None = Query(None),
    ordering: str | None = Query(None),
    page: int = 1,
    page_size: int = 10,
    session: Session = Depends(get_session),
):
    offset = (page - 1) * page_size
    products, total = crud.list_products(session, search, ordering, offset, page_size)
    return products


@router.get("/p/{slug}", response_model=schemas.ProductRead)
def get_product_by_slug(slug: str, session: Session = Depends(get_session)):
    statement = select(models.Product).where(models.Product.slug == slug)
    product = session.exec(statement).first()

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    return product



@router.post("/", response_model=schemas.ProductRead)
def create_product(
    payload: schemas.ProductCreate,
    session: Session = Depends(get_session),
    current_admin: User = Depends(get_current_admin),
):
    p = crud.create_product(session, name=payload.name, sku=payload.sku, price=payload.price, qty_in_stock=payload.qty_in_stock, is_active=payload.is_active, slug=payload.slug)
    return p


@router.get("/export/")
def export_products(format: str = "xlsx", session: Session = Depends(get_session)):
    products = session.exec(select(models.Product)).all()
    df = pd.DataFrame([p.dict() for p in products]) if products else pd.DataFrame()
    if format == "csv":
        buf = StringIO()
        df.to_csv(buf, index=False)
        buf.seek(0)
        return StreamingResponse(
            buf,
            media_type="text/csv",
            headers={"Content-Disposition": "attachment; filename=products.csv"},
        )
    else:
        buf = BytesIO()
        df.to_excel(buf, index=False, engine="openpyxl")
        buf.seek(0)
        return StreamingResponse(
            buf,
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            headers={"Content-Disposition": "attachment; filename=products.xlsx"},
        )


@router.post("/import/")
def import_products(file: UploadFile = File(...), session: Session = Depends(get_session)):
    if not file.filename.endswith((".xlsx", ".xls", ".csv")):
        raise HTTPException(status_code=400, detail="Unsupported file")
    if file.filename.endswith(".csv"):
        df = pd.read_csv(file.file)
    else:
        df = pd.read_excel(file.file)
    created = []
    errors = []
    for idx, row in df.fillna("").iterrows():
        try:
            name = row.get("name") or row.get("Name")
            sku = row.get("sku") or row.get("SKU")
            price = float(row.get("price") or 0)
            qty = int(row.get("qty_in_stock") or row.get("qty") or 0)
            p = crud.create_product(session, name=name, sku=sku, price=price, qty_in_stock=qty)
            created.append(p)
        except Exception as e:
            errors.append(str(e))
            continue
    return {"created": len(created), "errors": errors}

@router.put("/{product_id}", response_model=schemas.ProductRead)
def update_product(
    product_id: int,
    payload: schemas.ProductUpdate,
    session: Session = Depends(get_session),
    current_admin: User = Depends(get_current_admin),
):
    product = session.get(models.Product, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    # Update fields dynamically
    update_data = payload.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(product, key, value)

    session.add(product)
    session.commit()
    session.refresh(product)
    return product


@router.delete("/{product_id}")
def delete_product(
    product_id: int,
    session: Session = Depends(get_session),
    current_admin: User = Depends(get_current_admin),
):
    product = session.get(models.Product, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    session.delete(product)
    session.commit()
    return {"ok": True, "message": "Product deleted"}
