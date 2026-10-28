from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
import json
import pandas as pd

from .. import models, schemas
from ..database import get_db, engine
from ..services.data_cleaning import validate_and_clean_csv

router = APIRouter(prefix="/api/datasets", tags=["datasets"])

models.Base.metadata.create_all(bind=engine)


@router.post("/upload", response_model=schemas.UploadResponse)
async def upload_csv(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not file.filename.lower().endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are allowed")

    content = await file.read()
    try:
        df_clean, summary = validate_and_clean_csv(content)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Processing error: {str(e)}")

    dataset = models.Dataset(
        filename=file.filename,
        original_filename=file.filename,
        rows=summary["rows"],
        columns=json.dumps(summary["columns"]),
        status="cleaned",
    )
    db.add(dataset)
    db.commit()
    db.refresh(dataset)

    for _, row in df_clean.iterrows():
        order_date_val = row.get("order_date")
        if hasattr(order_date_val, "date"):
            order_date_val = order_date_val.date()
        sale = models.Sale(
            dataset_id=dataset.id,
            order_id=str(row.get("order_id", "")),
            order_date=order_date_val,
            customer_id=str(row.get("customer_id", "Unknown")),
            product=str(row.get("product", "Unknown")),
            category=str(row.get("category", "Unknown")),
            quantity=float(row.get("quantity", 0)) if pd.notna(row.get("quantity")) else 0.0,
            unit_price=float(row.get("unit_price", 0)) if pd.notna(row.get("unit_price")) else 0.0,
            order_value=float(row.get("order_value", 0)) if pd.notna(row.get("order_value")) else 0.0,
            year=int(row.get("year")) if pd.notna(row.get("year")) else None,
            month=int(row.get("month")) if pd.notna(row.get("month")) else None,
            raw_data=json.dumps(row.to_dict(), default=str),
        )
        db.add(sale)
    db.commit()

    return schemas.UploadResponse(
        dataset_id=dataset.id,
        filename=dataset.filename,
        rows=dataset.rows,
        columns=summary["columns"],
        status=dataset.status,
        message="CSV uploaded and cleaned successfully",
    )
