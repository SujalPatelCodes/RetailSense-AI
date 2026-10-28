import { useState, useEffect } from "react";
import api from "../services/api";
import KPICard from "../components/KPICard";

export default function Dashboard({ datasetId = 1 }) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSummary();
  }, [datasetId]);

  const fetchSummary = async () => {
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

  if (loading) return <div style={{ padding: "2rem" }}>Loading...</div>;
  if (error) return <div style={{ padding: "2rem", color: "#c33" }}>Error: {error}</div>;

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <h1>Sales Dashboard</h1>
      <p>Dataset ID: {datasetId}</p>

      {summary && (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "1rem",
          marginTop: "2rem"
        }}>
          <KPICard title="Total Revenue" value={`$${summary.total_revenue.toLocaleString()}`} />
          <KPICard title="Orders" value={summary.order_count.toLocaleString()} />
          <KPICard title="Units Sold" value={summary.units_sold.toLocaleString()} />
          <KPICard title="Avg Order Value" value={`$${summary.average_order_value.toLocaleString()}`} />
          <KPICard title="Unique Customers" value={summary.unique_customers.toLocaleString()} />
          <KPICard title="Unique Products" value={summary.unique_products.toLocaleString()} />
        </div>
      )}
    </div>
  );
}
