import { useState, useEffect } from "react";
import api from "../services/api";
import Plot from "react-plotly.js";

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
        <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Customer Segmentation</h1>
        <p style={{ color: '#475569', marginBottom: '2rem' }}>Group customers by purchasing behavior</p>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          padding: '3rem 2rem',
          textAlign: 'center',
        }}>
          <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem', color: '#0f172a' }}>No Dataset Uploaded</h3>
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Upload a CSV with customer data to see segments</p>
        </div>
      </div>
    );
  }

  if (loading) return <div style={{ padding: "2rem", color: '#64748b' }}>Loading...</div>;
  if (error) return <div style={{ padding: "2rem", color: "#dc2626" }}>Error: {error}</div>;

  return (
    <div style={{ padding: "2rem", maxWidth: "1000px", margin: "0 auto" }}>
      <h1>Customer Segmentation (KMeans)</h1>
      <p>Dataset ID: {datasetId}</p>
      {info && <p>Total Customers: {info.total_customers}, Clusters: {info.n_clusters}</p>}

      {segments.length > 0 && (
        <>
          <Plot
            data={[
              {
                x: segments.map(s => `Cluster ${s.cluster}`),
                y: segments.map(s => s.count),
                type: "bar",
                name: "Customer Count",
              },
            ]}
            layout={{ title: "Customers per Segment", yaxis: { title: "Count" }, autosize: true }}
            style={{ width: "100%", height: "400px" }}
            useResizeHandler={true}
          />

          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "2rem" }}>
            <thead>
              <tr style={{ background: "#f5f5f5" }}>
                <th style={{ padding: "0.75rem", textAlign: "left", border: "1px solid #ddd" }}>Cluster</th>
                <th style={{ padding: "0.75rem", textAlign: "right", border: "1px solid #ddd" }}>Count</th>
                <th style={{ padding: "0.75rem", textAlign: "right", border: "1px solid #ddd" }}>Avg Spending</th>
                <th style={{ padding: "0.75rem", textAlign: "right", border: "1px solid #ddd" }}>Avg Frequency</th>
                <th style={{ padding: "0.75rem", textAlign: "right", border: "1px solid #ddd" }}>Avg Order Value</th>
              </tr>
            </thead>
            <tbody>
              {segments.map((s) => (
                <tr key={s.cluster}>
                  <td style={{ padding: "0.75rem", border: "1px solid #ddd" }}>Cluster {s.cluster}</td>
                  <td style={{ padding: "0.75rem", textAlign: "right", border: "1px solid #ddd" }}>{s.count}</td>
                  <td style={{ padding: "0.75rem", textAlign: "right", border: "1px solid #ddd" }}>${s.avg_total_spending}</td>
                  <td style={{ padding: "0.75rem", textAlign: "right", border: "1px solid #ddd" }}>{s.avg_purchase_frequency}</td>
                  <td style={{ padding: "0.75rem", textAlign: "right", border: "1px solid #ddd" }}>${s.avg_order_value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
