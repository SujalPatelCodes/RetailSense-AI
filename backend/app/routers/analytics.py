from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from collections import defaultdict

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


@router.get("/{dataset_id}/trends")
def get_trends(dataset_id: int, db: Session = Depends(get_db)):
    sales = db.query(models.Sale).filter(models.Sale.dataset_id == dataset_id).all()
    if not sales:
        raise HTTPException(status_code=404, detail="No sales data found")

    monthly = defaultdict(lambda: {"revenue": 0, "orders": set(), "units": 0})
    for s in sales:
        if s.year and s.month:
            key = f"{s.year}-{s.month:02d}"
            monthly[key]["revenue"] += s.order_value or 0
            monthly[key]["orders"].add(s.order_id)
            monthly[key]["units"] += s.quantity or 0

    result = []
    for key in sorted(monthly.keys()):
        result.append({
            "period": key,
            "revenue": round(float(monthly[key]["revenue"]), 2),
            "orders": len(monthly[key]["orders"]),
            "units": round(float(monthly[key]["units"]), 2),
        })
    return {"dataset_id": dataset_id, "trends": result}


@router.get("/{dataset_id}/products")
def get_products(dataset_id: int, db: Session = Depends(get_db)):
    sales = db.query(models.Sale).filter(models.Sale.dataset_id == dataset_id).all()
    if not sales:
        raise HTTPException(status_code=404, detail="No sales data found")

    products = defaultdict(lambda: {"revenue": 0, "quantity": 0, "orders": set(), "category": "Unknown"})
    for s in sales:
        prod = s.product or "Unknown"
        products[prod]["revenue"] += s.order_value or 0
        products[prod]["quantity"] += s.quantity or 0
        products[prod]["orders"].add(s.order_id)
        products[prod]["category"] = s.category or "Unknown"

    result = []
    for prod, data in products.items():
        result.append({
            "product": prod,
            "category": data["category"],
            "revenue": round(float(data["revenue"]), 2),
            "quantity": round(float(data["quantity"], 2), 2) if False else round(float(data["quantity"]), 2),
            "orders": len(data["orders"]),
        })
    # Fix quantity rounding
    result = []
    for prod, data in products.items():
        result.append({
            "product": prod,
            "category": data["category"],
            "revenue": round(float(data["revenue"]), 2),
            "quantity": round(float(data["quantity"]), 2),
            "orders": len(data["orders"]),
        })
    result.sort(key=lambda x: x["revenue"], reverse=True)
    return {"dataset_id": dataset_id, "products": result}
