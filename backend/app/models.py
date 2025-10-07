from sqlmodel import SQLModel, Field
from typing import Optional
from enum import Enum
from datetime import datetime
from pydantic import EmailStr


class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True, nullable=False)
    full_name: str
    hashed_password: str
    is_superuser: bool = False

class OrderStatus(str, Enum):
    NEW = "NEW"
    PAID = "PAID"
    SHIPPED = "SHIPPED"
    CANCELED = "CANCELED"

class Product(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    slug: str = Field(default="", index=True, sa_column_kwargs={"unique": True})
    sku: str = Field(index=True, nullable=False, sa_column_kwargs={"unique": True})
    price: float = Field(default=0.0)
    qty_in_stock: int = Field(default=0)
    is_active: bool = Field(default=True)

class Customer(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    full_name: str
    email: Optional[str] = None
    phone: Optional[str] = None

class Order(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    customer_id: Optional[int] = Field(default=None, foreign_key="customer.id")
    status: OrderStatus = Field(default=OrderStatus.NEW)
    total: float = Field(default=0.0)
    created_at: datetime = Field(default_factory=datetime.utcnow)

class OrderItem(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    order_id: Optional[int] = Field(default=None, foreign_key="order.id")
    product_id: Optional[int] = Field(default=None, foreign_key="product.id")
    qty: int = Field(default=1)
    unit_price: float = Field(default=0.0)
    line_total: float = Field(default=0.0)
