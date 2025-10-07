from pydantic import BaseModel,EmailStr, validator,ConfigDict,constr
from typing import List, Optional
from enum import Enum
from datetime import datetime

class OrderStatus(str, Enum):
    NEW = "NEW"
    PAID = "PAID"
    SHIPPED = "SHIPPED"
    CANCELED = "CANCELED"

class ProductCreate(BaseModel):
    name: str
    sku: str
    price: float = 0.0
    qty_in_stock: int = 0
    is_active: bool = True
    slug: Optional[str] = None

    @validator("price")
    def price_non_negative(cls, v):
        if v < 0:
            raise ValueError("price must be >= 0")
        return v

    @validator("qty_in_stock")
    def qty_non_negative(cls, v):
        if v < 0:
            raise ValueError("qty_in_stock must be >= 0")
        return v

class ProductRead(ProductCreate):
    id: int
    slug: Optional[str]

    model_config = ConfigDict(from_attributes=True)

class OrderItemCreate(BaseModel):
    product_id: int
    qty: int
    unit_price: float

    @validator("qty")
    def qty_gt_zero(cls, v):
        if v <= 0:
            raise ValueError("qty must be > 0")
        return v

    @validator("unit_price")
    def unit_price_non_negative(cls, v):
        if v < 0:
            raise ValueError("unit_price must be >= 0")
        return v

class OrderCreate(BaseModel):
    customer_id: int
    status: OrderStatus = OrderStatus.NEW
    items: List[OrderItemCreate]

class OrderRead(BaseModel):
    id: int
    customer_id: int
    status: OrderStatus
    total: float
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class UserCreate(BaseModel):
    email: str
    full_name: str
    password: str


class UserRead(BaseModel):
    id: int
    email: str
    full_name: str
    is_superuser: bool
    class Config:
        from_attributes = True
