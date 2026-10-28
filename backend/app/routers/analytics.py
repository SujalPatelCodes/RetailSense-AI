from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional
import json

from .. import models
from ..database import get_db

router = APIRouter(prefix="/api/datasets", tags=["analytics"])


@router.get("/{dataset_id}/summary")
def get_summary(dataset_id: int, db: Session = Depends(get_db)):
    dataset = db.query(models.Dataset).filter(models.Dataset.id == dataset_id).first()
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found")

    sales = db.query(models.Sale).filter(models.Sale.dataset_id == dataset_id).all()
    if not sales:
        raise HTTPException(status_code=404, detail="No sales data found")

    total_revenue = sum(s.order_value or 0 for s in sales)
    order_count = len(set(s.order_id for s in sales))
    units_sold = sum(s.quantity or 0 for s in sales)
    average_order_value = total_revenue / order_count if order_count > 0 else 0
    unique_customers = len(set(s.customer_id for s in sales if s.customer_id and s.customer_id != "Unknown"))
    unique_products = len(set(s.product for s in sales if s.product and s.product != "Unknown"))

    return {
        "dataset_id": dataset_id,
        "total_revenue": round(float(total_revenue), 2),
        "order_count": order_count,
        "units_sold": round(float(units_sold), 2),
        "average_order_value": round(float(average_order_value), 2),
        "unique_customers": unique_customers,
        "unique_products": unique_products,
    }
