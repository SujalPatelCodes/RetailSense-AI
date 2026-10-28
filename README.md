# RetailSense AI

Sales Analytics and Intelligent Business Insights using free and open-source tools.

## Stack

- **Frontend**: React + Vite
- **Backend**: Python + FastAPI
- **Data Processing**: Pandas
- **Machine Learning**: Scikit-learn
- **Charts**: Plotly (plotly.js / react-plotly.js)
- **Database**: SQLite
- **Local AI**: Ollama with a locally downloaded model
- **Testing**: pytest (backend), Vitest + React Testing Library (frontend)

## Phase 1 - Project Setup and Architecture

Current status: Phase 1 scaffolding complete.

### Project Structure

```
RetailSense AI/
├── frontend/          # React + Vite app
├── backend/           # FastAPI app
│   ├── app/
│   │   ├── main.py
│   │   ├── database.py
│   │   ├── routers/
│   │   └── services/
│   ├── tests/
│   └── requirements.txt
├── data/              # Sample data (to be added)
└── README.md
```

### Setup Instructions

#### Prerequisites

- Node.js (v18+)
- Python 3.10+
- Git

#### Backend Setup

```bash
cd backend
python -m venv venv
# Windows
venv\Scripts\activate
# Linux/Mac
# source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Backend runs at: http://localhost:8000  
API docs: http://localhost:8000/docs

#### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: http://localhost:5173

### API Routes (Planned)

- `GET /api/health` - Health check
- `POST /api/datasets/upload` - Upload and validate CSV
- `GET /api/datasets/{dataset_id}/summary` - KPI metrics
- `GET /api/datasets/{dataset_id}/trends` - Monthly trends
- `GET /api/datasets/{dataset_id}/products` - Product rankings
- `GET /api/datasets/{dataset_id}/customers/segments` - Customer segments
- `POST /api/datasets/{dataset_id}/assistant` - AI Q&A (Ollama)
- `GET /` - Root

## Notes

- Runs entirely locally with no paid services
- SQLite requires no separate database server
- Ollama runs models locally (hardware dependent)
- Avoids paid hosting/AI APIs
