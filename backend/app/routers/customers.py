from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
import pandas as pd

from .. import models
from ..database import get_db

router = APIRouter(prefix="/api/datasets", tags=["customers"])


@router.get("/{dataset_id}/customers/segments")
def get_customer_segments(dataset_id: int, n_clusters: int = 3, db: Session = Depends(get_db)):
    sales = db.query(models.Sale).filter(models.Sale.dataset_id == dataset_id).all()
    if not sales:
        raise HTTPException(status_code=404, detail="No sales data found")

    # Build customer dataframe
    data = []
    for s in sales:
        data.append({
            "customer_id": s.customer_id or "Unknown",
            "order_id": s.order_id,
            "order_value": s.order_value or 0,
        })
    df = pd.DataFrame(data)
    if df.empty or "customer_id" not in df.columns:
        raise HTTPException(status_code=400, detail="Customer data unavailable")

    # Filter out Unknown if possible
    df_cust = df[df["customer_id"] != "Unknown"]
    if df_cust.empty:
        raise HTTPException(status_code=400, detail="No valid customer IDs found for segmentation")

    customer_agg = df_cust.groupby("customer_id").agg(
        total_spending=("order_value", "sum"),
        purchase_frequency=("order_id", "nunique"),
        avg_order_value=("order_value", "mean"),
    ).reset_index()

    if len(customer_agg) < n_clusters:
        n_clusters = max(1, len(customer_agg))

    features = ["total_spending", "purchase_frequency", "avg_order_value"]
    X = customer_agg[features].fillna(0)
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    kmeans = KMeans(n_clusters=n_clusters, random_state=42, n_init=10)
    customer_agg["cluster"] = kmeans.fit_predict(X_scaled)

    # Build segments summary
    segments = []
    for c in range(n_clusters):
        cluster_data = customer_agg[customer_agg["cluster"] == c]
        segments.append({
            "cluster": int(c),
            "count": int(len(cluster_data)),
            "avg_total_spending": round(float(cluster_data["total_spending"].mean()), 2),
            "avg_purchase_frequency": round(float(cluster_data["purchase_frequency"].mean()), 2),
            "avg_order_value": round(float(cluster_data["avg_order_value"].mean()), 2),
        })

    return {
        "dataset_id": dataset_id,
        "n_clusters": n_clusters,
        "segments": segments,
        "total_customers": int(len(customer_agg)),
    }
