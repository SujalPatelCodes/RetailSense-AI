# RetailSense AI

Sales Analytics and Intelligent Business Insights using free and open-source tools.

## Stack (Free Only)
- Frontend: React + Vite
- Backend: Python + FastAPI
- Data Processing: Pandas
- Machine Learning: Scikit-learn
- Charts: Plotly (plotly.js / react-plotly.js)
- Database: SQLite
- Local AI: Ollama
- Testing: pytest

## Project Structure
```
RetailSense AI/
├── frontend/          # React + Vite app
├── backend/           # FastAPI app
│   ├── app/
│   │   ├── main.py, database.py, models.py, schemas.py
│   │   ├── routers/   # datasets, analytics, customers, assistant
│   │   └── services/  # data_cleaning
│   ├── tests/
│   └── requirements.txt
├── data/              # Sample data
│   └── sample_sales.csv
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- Python 3.10+
- Git
- (Optional) Ollama for local AI assistant

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```
Backend runs at: http://localhost:8000  
API docs: http://localhost:8000/docs

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at: http://localhost:5173

### Ollama (Optional)
```bash
ollama pull llama3.2
ollama serve
```

## Features Completed
- Phase 1: Project setup and architecture
- Phase 2: CSV upload, validation, cleaning, SQLite storage
- Phase 3: KPI dashboard
- Phase 4: Sales trends and product performance
- Phase 5: Customer segmentation with KMeans
- Phase 6: Local AI assistant with Ollama
- Phase 7: Testing, sample data, documentation

## API Routes
- GET /api/health
- POST /api/datasets/upload
- GET /api/datasets/{dataset_id}/summary
- GET /api/datasets/{dataset_id}/trends
- GET /api/datasets/{dataset_id}/products
- GET /api/datasets/{dataset_id}/customers/segments
- POST /api/datasets/{dataset_id}/assistant

## Testing
```bash
cd backend
pytest
```

## Notes
- Runs entirely locally with no paid services
- SQLite requires no separate database server
- AI assistant works with Ollama or falls back to computed facts
- Uses only free and open-source tools
