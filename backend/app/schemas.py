from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class UploadResponse(BaseModel):
    dataset_id: int
    filename: str
    rows: int
    columns: List[str]
    status: str
    message: str


class HealthResponse(BaseModel):
    status: str
    service: str
