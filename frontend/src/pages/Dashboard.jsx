import { useState, useEffect } from "react";
import api from "../services/api";
import { DollarSign, ShoppingCart, Package, Users, TrendingUp, FileText } from "lucide-react";

function KPICard({ title, value, icon: Icon, trend }) {
  return (
    <div style={{
      backgroundColor: 'white',
      padding: '1.5rem',
      borderRadius: '16px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '1rem',
    }}>
      <div style={{
        width: '48px',
        height: '48px',
        backgroundColor: '#eef2ff',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Icon size={24} style={{ color: '#6366f1' }} />
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: '0.8125rem', color: '#64748b', marginBottom: '0.375rem', fontWeight: '500' }}>{title}</p>
        <p style={{ fontSize: '1.875rem', fontWeight: '600', color: '#0f172a', marginBottom: '0.25rem' }}>{value}</p>
        {trend && <p style={{ fontSize: '0.75rem', color: '#10b981', margin: 0 }}>{trend}</p>}
      </div>
    </div>
  );
}

export default function Dashboard({ datasetId }) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (datasetId) {
      fetchSummary();
    }
  }, [datasetId]);

  const fetchSummary = async () => {
    if (!datasetId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/api/datasets/${datasetId}/summary`);
      setSummary(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!datasetId) {
    return (
      <div style={{ maxWidth: '1400px' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.375rem', color: '#0f172a' }}>Sales Overview</h2>
          <p style={{ color: '#475569', fontSize: '0.875rem', margin: 0 }}>Key metrics for your sales data</p>
        </div>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          padding: '3rem 2rem',
          textAlign: 'center',
        }}>
          <FileText size={48} style={{ color: '#cbd5e1', margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem', color: '#0f172a' }}>No Dataset Uploaded</h3>
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Upload a CSV file from the Upload page to see your dashboard analytics</p>
        </div>
      </div>
    );
  }

  if (loading) return <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>Loading dashboard...</div>;
  if (error) return (
    <div style={{
      backgroundColor: '#fef2f2',
      border: '1px solid #fecaca',
      borderRadius: '12px',
      padding: '1.5rem',
      color: '#dc2626'
    }}>
      <p style={{ fontWeight: '500', marginBottom: '0.25rem' }}>Error loading dashboard</p>
      <p style={{ fontSize: '0.875rem', margin: 0 }}>{error}</p>
    </div>
  );

  return (
    <div style={{ maxWidth: '1400px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.375rem', color: '#0f172a' }}>Sales Overview</h2>
        <p style={{ color: '#475569', fontSize: '0.875rem', margin: 0 }}>Key metrics for Dataset ID: {datasetId}</p>
      </div>

      {summary && (
        <>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.25rem',
            marginBottom: '2rem'
          }}>
            <KPICard title="Total Sales" value={`$${summary.total_revenue.toLocaleString()}`} icon={DollarSign} />
            <KPICard title="Total Orders" value={summary.order_count.toLocaleString()} icon={ShoppingCart} />
            <KPICard title="Units Sold" value={summary.units_sold.toLocaleString()} icon={Package} />
            <KPICard title="Average Order Value" value={`$${summary.average_order_value.toLocaleString()}`} icon={TrendingUp} />
            <KPICard title="Unique Customers" value={summary.unique_customers.toLocaleString()} icon={Users} />
            <KPICard title="Unique Products" value={summary.unique_products.toLocaleString()} icon={FileText} />
          </div>

          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            padding: '2rem',
            textAlign: 'center',
          }}>
            <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem', color: '#0f172a' }}>Sales Overview Chart</h3>
            <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Use the Trends page to view detailed charts and analytics</p>
          </div>
        </>
      )}

      {!summary && !loading && !error && (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          padding: '3rem 2rem',
          textAlign: 'center',
        }}>
          <FileText size={48} style={{ color: '#cbd5e1', margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem', color: '#0f172a' }}>No Data Available</h3>
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Upload a CSV file to see your dashboard analytics</p>
        </div>
      )}
    </div>
  );
}
