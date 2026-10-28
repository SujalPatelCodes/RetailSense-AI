import { useState } from 'react'
import Upload from './pages/Upload'
import Dashboard from './pages/Dashboard'
import './App.css'

function App() {
  const [view, setView] = useState('upload')
  const [datasetId, setDatasetId] = useState(1)

  return (
    <div>
      <nav style={{ padding: '1rem 2rem', background: '#f5f5f5', borderBottom: '1px solid #ddd', display: 'flex', gap: '2rem', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>RetailSense AI</h2>
        <button onClick={() => setView('upload')}>Upload</button>
        <button onClick={() => setView('dashboard')}>Dashboard</button>
      </nav>
      {view === 'upload' && <Upload />}
      {view === 'dashboard' && <Dashboard datasetId={datasetId} />}
    </div>
  )
}

export default App


