import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import Upload from './pages/Upload'
import Dashboard from './pages/Dashboard'
import Trends from './pages/Trends'
import Segments from './pages/Segments'
import Assistant from './pages/Assistant'

function App() {
  const [currentView, setCurrentView] = useState('upload')
  const [datasetId, setDatasetId] = useState(() => {
    const saved = localStorage.getItem('retailsense_dataset_id')
    return saved ? parseInt(saved) : 1
  })
  const [datasetInfo, setDatasetInfo] = useState(() => {
    const saved = localStorage.getItem('retailsense_dataset_info')
    return saved ? JSON.parse(saved) : null
  })

  useEffect(() => {
    localStorage.setItem('retailsense_dataset_id', datasetId.toString())
  }, [datasetId])

  useEffect(() => {
    if (datasetInfo) {
      localStorage.setItem('retailsense_dataset_info', JSON.stringify(datasetInfo))
    } else {
      localStorage.removeItem('retailsense_dataset_info')
    }
  }, [datasetInfo])

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard datasetId={datasetId} />
      case 'upload':
        return <Upload datasetInfo={datasetInfo} setDatasetInfo={setDatasetInfo} setDatasetId={setDatasetId} setCurrentView={setCurrentView} />
      case 'trends':
        return <Trends datasetId={datasetId} />
      case 'segments':
        return <Segments datasetId={datasetId} />
      case 'assistant':
        return <Assistant datasetId={datasetId} />
      default:
        return <Upload datasetInfo={datasetInfo} setDatasetInfo={setDatasetInfo} setDatasetId={setDatasetId} setCurrentView={setCurrentView} />
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      <Header currentView={currentView} />
      <main style={{
        marginLeft: '280px',
        padding: '2rem',
        minHeight: 'calc(100vh - 85px)',
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          {renderView()}
        </div>
      </main>
    </div>
  )
}

export default App

