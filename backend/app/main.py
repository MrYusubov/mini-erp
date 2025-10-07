from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .db import init_db
from .routers import products, customers, orders,auth

app = FastAPI(title="MiniERP", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# DB init
@app.on_event("startup")
def on_startup():
    init_db()


# Routers
app.include_router(products.router)
app.include_router(customers.router)
app.include_router(orders.router)

app.include_router(auth.router)


@app.get("/")
def root():
    return {"message": "MiniERP API is running"}
