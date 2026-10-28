# RetailSense AI - Backend

FastAPI backend for RetailSense AI sales analytics.

## Setup
```bash
pip install -r requirements.txt
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

API docs at http://127.0.0.1:8000/docs

## Structure
- `app/main.py` - FastAPI app
- `app/models.py` - SQLAlchemy models
- `app/routers/` - API endpoints
- `app/services/data_cleaning.py` - CSV cleaning logic
- `tests/` - pytest tests
