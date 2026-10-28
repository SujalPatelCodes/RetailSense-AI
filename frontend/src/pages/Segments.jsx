import { useState, useEffect } from "react";
import api from "../services/api";
import Plot from "react-plotly.js";
import { Users, PieChart } from "lucide-react";

export default function Segments({ datasetId }) {
  const [segments, setSegments] = useState([]);
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (datasetId) {
      fetchSegments();
    }
  }, [datasetId]);

  const fetchSegments = async () => {
    if (!datasetId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/api/datasets/${datasetId}/customers/segments?n_clusters=3`);
      setSegments(res.data.segments || []);
      setInfo(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!datasetId) {
    return (
      <div style={{ maxWidth: '1000px' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.375rem', color: '#0f172a' }}>Customer Segmentation</h2>
          <p style={{ color: '#475569', fontSize: '0.875rem', margin: 0 }}>Group customers by purchasing behavior</p>
        </div>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          padding: '3rem 2rem',
          textAlign: 'center',
        }}>
          <Users size={48} style={{ color: '#cbd5e1', margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem', color: '#0f172a' }}>No Dataset Uploaded</h3>
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Upload a CSV with customer data to see segments</p>
        </div>
      </div>
    );
  }

  if (loading) return (
    <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
      Loading segments...
    </div>
  );
  if (error) return (
    <div style={{
      backgroundColor: '#fef2f2',
      border: '1px solid #fecaca',
      borderRadius: '12px',
      padding: '1.5rem',
      color: '#dc2626'
    }}>
      <p style={{ fontWeight: '500', marginBottom: '0.25rem' }}>Error</p>
      <p style={{ fontSize: '0.875rem', margin: 0 }}>{error}</p>
    </div>
  );

  return (
    <div style={{ maxWidth: '1000px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.375rem', color: '#0f172a' }}>Customer Segmentation</h2>
        <p style={{ color: '#475569', fontSize: '0.875rem', margin: 0 }}>KMeans clustering • Dataset ID: {datasetId}</p>
        {info && <p style={{ color: '#64748b', fontSize: '0.8125rem', marginTop: '0.25rem' }}>{info.total_customers} customers • {info.n_clusters} clusters</p>}
      </div>

      {segments.length > 0 && (
        <>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            padding: '1.5rem',
            marginBottom: '2rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <PieChart size={20} style={{ color: '#6366f1' }} />
              <h3 style={{ fontSize: '1.125rem', color: '#0f172a', margin: 0 }}>Segment Distribution</h3>
            </div>
            <Plot
              data={[
                {
                  x: segments.map(s => `Cluster ${s.cluster}`),
                  y: segments.map(s => s.count),
                  type: "bar",
                  marker: { color: '#6366f1' },
                },
              ]}
              layout={{
                autosize: true,
                margin: { l: 60, r: 40, t: 20, b: 60 },
                xaxis: { gridcolor: '#f1f5f9' },
                yaxis: { title: "Count", gridcolor: '#f1f5f9' },
                plot_bgcolor: 'white',
                paper_bgcolor: 'white',
              }}
              style={{ width: "100%", height: "350px" }}
              useResizeHandler={true}
              config={{ displayModeBar: false }}
            />
          </div>

          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            overflow: 'hidden',
          }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f1f5f9' }}>
              <h3 style={{ fontSize: '1.125rem', color: '#0f172a', margin: 0 }}>Segment Profiles</h3>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc' }}>
                    <th style={{ padding: "0.75rem 1.5rem", textAlign: "left", fontSize: '0.75rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Cluster</th>
                    <th style={{ padding: "0.75rem 1.5rem", textAlign: "right", fontSize: '0.75rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Count</th>
                    <th style={{ padding: "0.75rem 1.5rem", textAlign: "right", fontSize: '0.75rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Avg Spending</th>
                    <th style={{ padding: "0.75rem 1.5rem", textAlign: "right", fontSize: '0.75rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Avg Frequency</th>
                    <th style={{ padding: "0.75rem 1.5rem", textAlign: "right", fontSize: '0.75rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Avg Order Value</th>
                  </tr>
                </thead>
                <tbody>
                  {segments.map((s) => (
                    <tr key={s.cluster} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: "0.875rem 1.5rem", fontSize: '0.875rem', color: '#0f172a', fontWeight: '500' }}>Cluster {s.cluster}</td>
                      <td style={{ padding: "0.875rem 1.5rem", textAlign: "right", fontSize: '0.875rem', color: '#475569' }}>{s.count}</td>
                      <td style={{ padding: "0.875rem 1.5rem", textAlign: "right", fontSize: '0.875rem', color: '#0f172a', fontWeight: '500' }}>${s.avg_total_spending}</td>
                      <td style={{ padding: "0.875rem 1.5rem", textAlign: "right", fontSize: '0.875rem', color: '#475569' }}>{s.avg_purchase_frequency}</td>
                      <td style={{ padding: "0.875rem 1.5rem", textAlign: "right", fontSize: '0.875rem', color: '#475569' }}>${s.avg_order_value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
