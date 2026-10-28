import { useState, useEffect } from "react";
import api from "../services/api";
import Plot from "react-plotly.js";

export default function Trends({ datasetId }) {
  const [trends, setTrends] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (datasetId) {
      fetchData();
    }
  }, [datasetId]);

  const fetchData = async () => {
    if (!datasetId) return;
    setLoading(true);
    setError(null);
    try {
      const [tRes, pRes] = await Promise.all([
        api.get(`/api/datasets/${datasetId}/trends`),
        api.get(`/api/datasets/${datasetId}/products`),
      ]);
      setTrends(tRes.data.trends || []);
      setProducts(pRes.data.products || []);
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!datasetId) {
    return (
      <div style={{ maxWidth: '1200px' }}>
        <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Sales Trends & Product Performance</h1>
        <p style={{ color: '#475569', marginBottom: '2rem' }}>Analyze sales patterns over time</p>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          padding: '3rem 2rem',
          textAlign: 'center',
        }}>
          <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem', color: '#0f172a' }}>No Dataset Uploaded</h3>
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Upload a CSV file to see trends and product performance</p>
        </div>
      </div>
    );
  }

  if (loading) return <div style={{ padding: "2rem", color: '#64748b' }}>Loading...</div>;
  if (error) return <div style={{ padding: "2rem", color: "#dc2626" }}>Error: {error}</div>;

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <h1>Sales Trends & Product Performance</h1>
      <p>Dataset ID: {datasetId}</p>

      {trends.length > 0 && (
        <div style={{ marginTop: "2rem" }}>
          <h2>Monthly Revenue Trend</h2>
          <Plot
            data={[
              {
                x: trends.map(t => t.period),
                y: trends.map(t => t.revenue),
                type: "scatter",
                mode: "lines+markers",
                name: "Revenue",
              },
            ]}
            layout={{ title: "Monthly Revenue", xaxis: { title: "Period" }, yaxis: { title: "Revenue ($)" }, autosize: true }}
            style={{ width: "100%", height: "400px" }}
            useResizeHandler={true}
          />
        </div>
      )}

      {products.length > 0 && (
        <div style={{ marginTop: "2rem" }}>
          <h2>Top Products</h2>
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
            <thead>
              <tr style={{ background: "#f5f5f5" }}>
                <th style={{ padding: "0.75rem", textAlign: "left", border: "1px solid #ddd" }}>Product</th>
                <th style={{ padding: "0.75rem", textAlign: "left", border: "1px solid #ddd" }}>Category</th>
                <th style={{ padding: "0.75rem", textAlign: "right", border: "1px solid #ddd" }}>Revenue</th>
                <th style={{ padding: "0.75rem", textAlign: "right", border: "1px solid #ddd" }}>Quantity</th>
                <th style={{ padding: "0.75rem", textAlign: "right", border: "1px solid #ddd" }}>Orders</th>
              </tr>
            </thead>
            <tbody>
              {products.slice(0, 20).map((p, idx) => (
                <tr key={idx}>
                  <td style={{ padding: "0.75rem", border: "1px solid #ddd" }}>{p.product}</td>
                  <td style={{ padding: "0.75rem", border: "1px solid #ddd" }}>{p.category}</td>
                  <td style={{ padding: "0.75rem", textAlign: "right", border: "1px solid #ddd" }}>${p.revenue.toLocaleString()}</td>
                  <td style={{ padding: "0.75rem", textAlign: "right", border: "1px solid #ddd" }}>{p.quantity}</td>
                  <td style={{ padding: "0.75rem", textAlign: "right", border: "1px solid #ddd" }}>{p.orders}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
