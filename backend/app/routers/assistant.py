from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
import requests
import json

from .. import models
from ..database import get_db

router = APIRouter(prefix="/api/datasets", tags=["assistant"])


class QuestionRequest(BaseModel):
    question: str


@router.post("/{dataset_id}/assistant")
def ask_assistant(dataset_id: int, req: QuestionRequest, db: Session = Depends(get_db)):
    sales = db.query(models.Sale).filter(models.Sale.dataset_id == dataset_id).all()
    if not sales:
        raise HTTPException(status_code=404, detail="No sales data found")

    # Compute factual context with Pandas
    total_revenue = sum(s.order_value or 0 for s in sales)
    order_count = len(set(s.order_id for s in sales))
    units_sold = sum(s.quantity or 0 for s in sales)
    avg_order = total_revenue / order_count if order_count > 0 else 0

    context = f"""
Dataset facts (computed locally):
- Total revenue: ${total_revenue:.2f}
- Number of orders: {order_count}
- Units sold: {units_sold}
- Average order value: ${avg_order:.2f}
- Dataset ID: {dataset_id}

Question: {req.question}

Only answer based on these computed facts. If the question cannot be answered from these facts, say so clearly. Do not make up numbers.
"""

    # Try Ollama
    try:
        response = requests.post(
            "http://localhost:11434/api/generate",
            json={"model": "llama3.2", "prompt": context, "stream": False},
            timeout=60,
        )
        if response.status_code == 200:
            data = response.json()
            return {"answer": data.get("response", "No response"), "source": "ollama"}
    except Exception:
        pass

    # Fallback if Ollama unavailable
    return {
        "answer": f"Based on computed data: Total revenue ${total_revenue:.2f} across {order_count} orders with {units_sold} units sold (avg order ${avg_order:.2f}). Ollama is not running or model not available - showing computed facts only.",
        "source": "computed",
    }
