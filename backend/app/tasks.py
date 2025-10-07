from celery import Celery
import os
from sqlmodel import Session, select
from .models import Order
import pandas as pd
from datetime import datetime, timedelta

celery = Celery("mini_erp_tasks", broker=os.getenv("CELERY_BROKER_URL", "redis://localhost:6379/0"))


@celery.task
def daily_sales_report():

    from .db import engine
    with Session(engine) as session:
        since = datetime.utcnow() - timedelta(days=1)
        orders = session.exec(select(Order).where(Order.created_at >= since)).all()
        rows = []
        for o in orders:
            rows.append({
                "order_id": o.id,
                "customer_id": o.customer_id,
                "total": o.total,
                "status": o.status,
                "created_at": o.created_at,
            })
        df = pd.DataFrame(rows)
        path = "/tmp/daily_sales_report.xlsx"
        df.to_excel(path, index=False)
        return path
