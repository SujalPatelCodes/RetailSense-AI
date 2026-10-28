# RetailSense AI

Sales Analytics and Intelligent Business Insights using free and open-source tools.

## Tech Stack
- **Frontend:** React + Vite
- **Backend:** Python + FastAPI
- **Data Processing:** Pandas
- **Machine Learning:** Scikit-learn
- **Charts:** Plotly.js / react-plotly.js
- **Database:** SQLite
- **Local AI:** Ollama (optional)
- **Testing:** pytest

## Features
- CSV upload with validation and automatic cleaning
- Sales KPI dashboard
- Monthly trends and product performance analysis
- Customer segmentation with KMeans clustering
- Local AI assistant grounded in computed metrics
- Persistent local storage with SQLite

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
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js 18+
- Python 3.10+
- Git

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```
- API: http://127.0.0.1:8000
- Docs: http://127.0.0.1:8000/docs

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
- App: http://localhost:5173

### Ollama (Optional)
```bash
ollama pull llama3.2
ollama serve
```

## Usage
1. Start both backend and frontend servers
2. Navigate to Upload & Data Cleaning
3. Upload a CSV with required columns: `order_id`, `order_date`, `quantity`, `unit_price`
4. Optional columns: `customer_id`, `product`, `category`
5. View results in Dashboard, Trends, Segments, or AI Assistant

## API Endpoints
- `GET /api/health` - Health check
- `POST /api/datasets/upload` - Upload and clean CSV
- `GET /api/datasets/{id}/summary` - KPI metrics
- `GET /api/datasets/{id}/trends` - Monthly trends
- `GET /api/datasets/{id}/products` - Product rankings
- `GET /api/datasets/{id}/customers/segments` - Customer segments
- `POST /api/datasets/{id}/assistant` - AI Q&A

## Testing
```bash
cd backend
pytest
```

## Notes
- Runs entirely locally with no paid services
- SQLite requires no separate database server
- AI assistant works without Ollama using computed fallbacks
- Uses only free and open-source tools
