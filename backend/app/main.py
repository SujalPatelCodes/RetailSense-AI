from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import datasets, analytics, customers, assistant

app = FastAPI(
    title="RetailSense AI API",
    description="Sales Analytics and Intelligent Business Insights",
    version="0.6.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(datasets.router)
app.include_router(analytics.router)
app.include_router(customers.router)
app.include_router(assistant.router)


@app.get("/api/health")
def health_check():
    return {"status": "ok", "service": "RetailSense AI API"}


@app.get("/")
def root():
    return {"message": "RetailSense AI Backend", "docs": "/docs"}




