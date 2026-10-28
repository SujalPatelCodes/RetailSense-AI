import { useState, useEffect } from "react";
import api from "../services/api";
import Plot from "react-plotly.js";
import { TrendingUp, Package, BarChart3 } from "lucide-react";

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
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.375rem', color: '#0f172a' }}>Sales Trends & Product Performance</h2>
          <p style={{ color: '#475569', fontSize: '0.875rem', margin: 0 }}>Analyze sales patterns over time</p>
        </div>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          padding: '3rem 2rem',
          textAlign: 'center',
        }}>
          <BarChart3 size={48} style={{ color: '#cbd5e1', margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem', color: '#0f172a' }}>No Dataset Uploaded</h3>
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Upload a CSV file to see trends and product performance</p>
        </div>
      </div>
    );
  }

  if (loading) return (
    <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
      Loading trends...
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
    <div style={{ maxWidth: '1200px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.375rem', color: '#0f172a' }}>Sales Trends & Product Performance</h2>
        <p style={{ color: '#475569', fontSize: '0.875rem', margin: 0 }}>Dataset ID: {datasetId}</p>
      </div>

      {trends.length > 0 && (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          padding: '1.5rem',
          marginBottom: '2rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <TrendingUp size={20} style={{ color: '#6366f1' }} />
            <h3 style={{ fontSize: '1.125rem', color: '#0f172a', margin: 0 }}>Monthly Revenue Trend</h3>
          </div>
          <Plot
            data={[
              {
                x: trends.map(t => t.period),
                y: trends.map(t => t.revenue),
                type: "scatter",
                mode: "lines+markers",
                line: { color: '#6366f1', width: 2 },
                marker: { size: 8 },
                name: "Revenue",
              },
            ]}
            layout={{
              autosize: true,
              margin: { l: 60, r: 40, t: 20, b: 60 },
              xaxis: { title: "Period", gridcolor: '#f1f5f9' },
              yaxis: { title: "Revenue ($)", gridcolor: '#f1f5f9' },
              plot_bgcolor: 'white',
              paper_bgcolor: 'white',
            }}
            style={{ width: "100%", height: "400px" }}
            useResizeHandler={true}
            config={{ displayModeBar: false }}
          />
        </div>
      )}

      {products.length > 0 && (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
        }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Package size={20} style={{ color: '#6366f1' }} />
            <h3 style={{ fontSize: '1.125rem', color: '#0f172a', margin: 0 }}>Top Products</h3>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc' }}>
                  <th style={{ padding: "0.75rem 1.5rem", textAlign: "left", fontSize: '0.75rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Product</th>
                  <th style={{ padding: "0.75rem 1.5rem", textAlign: "left", fontSize: '0.75rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Category</th>
                  <th style={{ padding: "0.75rem 1.5rem", textAlign: "right", fontSize: '0.75rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Revenue</th>
                  <th style={{ padding: "0.75rem 1.5rem", textAlign: "right", fontSize: '0.75rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Quantity</th>
                  <th style={{ padding: "0.75rem 1.5rem", textAlign: "right", fontSize: '0.75rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Orders</th>
                </tr>
              </thead>
              <tbody>
                {products.slice(0, 20).map((p, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: "0.875rem 1.5rem", fontSize: '0.875rem', color: '#0f172a' }}>{p.product}</td>
                    <td style={{ padding: "0.875rem 1.5rem", fontSize: '0.875rem', color: '#475569' }}>{p.category}</td>
                    <td style={{ padding: "0.875rem 1.5rem", textAlign: "right", fontSize: '0.875rem', color: '#0f172a', fontWeight: '500' }}>${p.revenue.toLocaleString()}</td>
                    <td style={{ padding: "0.875rem 1.5rem", textAlign: "right", fontSize: '0.875rem', color: '#475569' }}>{p.quantity}</td>
                    <td style={{ padding: "0.875rem 1.5rem", textAlign: "right", fontSize: '0.875rem', color: '#475569' }}>{p.orders}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
