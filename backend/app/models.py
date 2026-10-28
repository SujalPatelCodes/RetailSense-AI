from sqlalchemy import Column, Integer, String, Float, Date, DateTime, Text
from sqlalchemy.sql import func
from .database import Base


class Dataset(Base):
    __tablename__ = "datasets"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String)
    original_filename = Column(String)
    upload_date = Column(DateTime(timezone=True), server_default=func.now())
    rows = Column(Integer)
    columns = Column(Text)
    status = Column(String, default="uploaded")


class Sale(Base):
    __tablename__ = "sales"

    id = Column(Integer, primary_key=True, index=True)
    dataset_id = Column(Integer, index=True)
    order_id = Column(String, index=True)
    order_date = Column(Date)
    customer_id = Column(String, index=True)
    product = Column(String, index=True)
    category = Column(String, index=True)
    quantity = Column(Float)
    unit_price = Column(Float)
    order_value = Column(Float)
    year = Column(Integer)
    month = Column(Integer)
    raw_data = Column(Text)
