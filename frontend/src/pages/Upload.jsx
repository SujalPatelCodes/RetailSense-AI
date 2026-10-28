import { useState, useRef, useEffect } from "react";
import api from "../services/api";
import { UploadCloud, FileText, X, CheckCircle, AlertCircle, Info, BarChart3, Database } from "lucide-react";

export default function Upload({ datasetInfo, setDatasetInfo, setDatasetId, setCurrentView }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(datasetInfo || null);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (datasetInfo) {
      setResult(datasetInfo);
      setFile(null);
    } else {
      setResult(null);
      setFile(null);
    }
  }, [datasetInfo]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (!selectedFile.name.toLowerCase().endsWith('.csv')) {
        setError('Only CSV files are allowed');
        return;
      }
      setFile(selectedFile);
      setResult(null);
      setError(null);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (!droppedFile.name.toLowerCase().endsWith('.csv')) {
        setError('Only CSV files are allowed');
        return;
      }
      setFile(droppedFile);
      setResult(null);
      setError(null);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !(file instanceof File)) {
      setError("Please select a CSV file");
      return;
    }
    setUploading(true);
    setError(null);
    setResult(null);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await api.post("/api/datasets/upload", formData);
      setResult(res.data);
      if (setDatasetInfo) setDatasetInfo(res.data);
      if (setDatasetId) setDatasetId(res.data.dataset_id);
    } catch (err) {
      console.error('Upload error:', err);
      let msg = "Upload failed";
      if (err.response?.data?.detail) {
        msg = typeof err.response.data.detail === 'string' ? err.response.data.detail : JSON.stringify(err.response.data.detail);
      } else if (err.message) {
        msg = err.message;
      }
      setError(msg);
    } finally {
      setUploading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setResult(null);
    setError(null);
    if (setDatasetInfo) setDatasetInfo(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return 'Unknown';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };


  return (
    <div style={{ maxWidth: '1000px' }}>
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #eef2ff 0%, rgba(139, 92, 246, 0.08) 100%)',
        borderRadius: '16px',
        padding: '2rem 2.5rem',
        marginBottom: '2rem',
        border: '1px solid rgba(99, 102, 241, 0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '2rem',
        flexWrap: 'wrap',
      }}>
        <div style={{ flex: 1, minWidth: '250px' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '600', marginBottom: '0.75rem', color: '#0f172a' }}>
            Turn sales data into smarter decisions
          </h2>
          <p style={{ color: '#475569', fontSize: '0.9375rem', margin: 0 }}>
            Upload your CSV to clean, organize, and prepare your retail data for AI-powered analytics.
          </p>
        </div>
        <div style={{
          width: '100px',
          height: '100px',
          backgroundColor: 'white',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          flexShrink: 0,
        }}>
          <BarChart3 size={48} style={{ color: '#6366f1' }} />
        </div>
      </div>

      {/* Active Dataset Banner */}
      {result && (
        <div style={{
          backgroundColor: 'white',
          border: '1px solid #a7f3d0',
          borderRadius: '12px',
          padding: '1rem 1.25rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          flexWrap: 'wrap',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              backgroundColor: '#f0fdf4',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Database size={20} style={{ color: '#10b981' }} />
            </div>
            <div>
              <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#065f46', marginBottom: '0.125rem' }}>
                Active Dataset: {result.filename || `Dataset ${result.dataset_id}`}
              </p>
              <p style={{ fontSize: '0.75rem', color: '#047857', margin: 0 }}>
                Dataset ID: {result.dataset_id} • {result.rows} records • Status: {result.status}
              </p>
            </div>
          </div>
          <button
            onClick={removeFile}
            style={{
              backgroundColor: 'transparent',
              color: '#047857',
              border: '1px solid #86efac',
              padding: '0.5rem 0.875rem',
              borderRadius: '6px',
              fontSize: '0.8125rem',
            }}
          >
            Upload New Dataset
          </button>
        </div>
      )}

      {/* Upload Card */}
      {!result && (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
          marginBottom: '2rem',
        }}>
          <div style={{ padding: '1.75rem 2rem', borderBottom: '1px solid #f1f5f9' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.375rem', color: '#0f172a' }}>Upload your sales data</h3>
            <p style={{ color: '#475569', fontSize: '0.875rem', margin: 0 }}>
              Upload a CSV file to get started with your retail analytics.
            </p>
          </div>

          <div style={{ padding: '2rem' }}>
            {!file ? (
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                style={{
                  border: `2px dashed ${dragActive ? '#6366f1' : '#cbd5e1'}`,
                  borderRadius: '12px',
                  padding: '3rem 2rem',
                  textAlign: 'center',
                  backgroundColor: dragActive ? '#eef2ff' : '#f8fafc',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                <div style={{
                  width: '64px',
                  height: '64px',
                  backgroundColor: 'white',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem',
                  border: '1px solid #e2e8f0',
                }}>
                  <UploadCloud size={28} style={{ color: '#6366f1' }} />
                </div>
                <p style={{ fontSize: '0.9375rem', fontWeight: '500', marginBottom: '0.375rem', color: '#0f172a' }}>
                  Drag and drop your CSV file here
                </p>
                <p style={{ fontSize: '0.8125rem', color: '#64748b', marginBottom: '1.25rem' }}>
                  or browse files from your device
                </p>
                <button type="button" style={{
                  backgroundColor: '#6366f1',
                  color: 'white',
                  padding: '0.625rem 1.5rem',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  border: 'none',
                }}>
                  Choose CSV File
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
                <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '1rem', marginBottom: 0 }}>
                  Supported format: CSV · Maximum file size: 10 MB
                </p>
              </div>
            ) : (
              <div style={{
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                backgroundColor: '#f8fafc',
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: '#eef2ff',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <FileText size={24} style={{ color: '#6366f1' }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#0f172a' }}>
                    {file.name}
                  </p>
                  <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>
                    {formatFileSize(file.size)}
                  </p>
                </div>
                <button
                  onClick={removeFile}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '6px',
                    backgroundColor: 'transparent',
                    color: '#94a3b8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 0,
                    border: 'none',
                  }}
                >
                  <X size={18} />
                </button>
              </div>
            )}

            {file && !result && (
              <button
                onClick={handleUpload}
                disabled={uploading}
                style={{
                  marginTop: '1.25rem',
                  width: '100%',
                  backgroundColor: uploading ? '#a5b4fc' : '#6366f1',
                  color: 'white',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  border: 'none',
                }}
              >
                {uploading ? 'Uploading & Analyzing...' : 'Upload & Analyze'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Data Requirements */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        padding: '1.75rem 2rem',
        marginBottom: '2rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.125rem', margin: 0, color: '#0f172a' }}>Data Requirements</h3>
          <Info size={16} style={{ color: '#94a3b8' }} />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <p style={{ fontSize: '0.8125rem', color: '#475569', marginBottom: '0.75rem', fontWeight: '500' }}>Required Columns</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {['order_id', 'order_date', 'quantity', 'unit_price'].map(col => (
              <span key={col} style={{
                padding: '0.375rem 0.75rem',
                backgroundColor: '#fef2f2',
                color: '#dc2626',
                borderRadius: '6px',
                fontSize: '0.8125rem',
                fontWeight: '500',
                border: '1px solid #fecaca',
              }}>
                {col}
              </span>
            ))}
          </div>
        </div>
        <div>
          <p style={{ fontSize: '0.8125rem', color: '#475569', marginBottom: '0.75rem', fontWeight: '500' }}>Optional Columns</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {['customer_id', 'product', 'category'].map(col => (
              <span key={col} style={{
                padding: '0.375rem 0.75rem',
                backgroundColor: '#f8fafc',
                color: '#475569',
                borderRadius: '6px',
                fontSize: '0.8125rem',
                border: '1px solid #e2e8f0',
              }}>
                {col}
              </span>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div style={{
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '12px',
          padding: '1rem 1.25rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.75rem',
        }}>
          <AlertCircle size={20} style={{ color: '#ef4444', flexShrink: 0, marginTop: '2px' }} />
          <div>
            <p style={{ color: '#991b1b', fontWeight: '500', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Error</p>
            <p style={{ color: '#dc2626', fontSize: '0.8125rem', margin: 0 }}>{error}</p>
          </div>
        </div>
      )}

      {result && (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          border: '1px solid #a7f3d0',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
        }}>
          <div style={{
            backgroundColor: '#f0fdf4',
            padding: '1.25rem 2rem',
            borderBottom: '1px solid #a7f3d0',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}>
            <CheckCircle size={22} style={{ color: '#10b981' }} />
            <div>
              <h3 style={{ color: '#065f46', fontSize: '1rem', marginBottom: '0.25rem' }}>Upload Successful</h3>
              <p style={{ color: '#047857', fontSize: '0.8125rem', margin: 0 }}>{result.message}</p>
            </div>
          </div>
          <div style={{ padding: '1.75rem 2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div>
                <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.375rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Dataset ID</p>
                <p style={{ fontSize: '1.25rem', fontWeight: '600', margin: 0, color: '#0f172a' }}>{result.dataset_id}</p>
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.375rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Records</p>
                <p style={{ fontSize: '1.25rem', fontWeight: '600', margin: 0, color: '#0f172a' }}>{result.rows}</p>
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.375rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</p>
                <p style={{ fontSize: '1rem', fontWeight: '500', color: '#10b981', margin: 0, textTransform: 'capitalize' }}>{result.status}</p>
              </div>
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <p style={{ fontSize: '0.8125rem', color: '#475569', marginBottom: '0.75rem', fontWeight: '500' }}>Detected Columns</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                {result.columns.map((col, idx) => (
                  <span key={idx} style={{
                    padding: '0.25rem 0.625rem',
                    backgroundColor: '#f8fafc',
                    color: '#475569',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    border: '1px solid #e2e8f0',
                  }}>
                    {col}
                  </span>
                ))}
              </div>
            </div>
            {setCurrentView && (
              <button
                onClick={() => setCurrentView('dashboard')}
                style={{
                  backgroundColor: '#6366f1',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <BarChart3 size={18} />
                View Dashboard
              </button>
            )}
          </div>
        </div>
      )}
    </div>

  );
}
