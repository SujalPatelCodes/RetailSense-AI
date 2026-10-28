export default function KPICard({ title, value, subtitle }) {
  return (
    <div style={{
      background: "#fff",
      padding: "1.5rem",
      borderRadius: "8px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      border: "1px solid #eee"
    }}>
      <h4 style={{ margin: 0, color: "#666", fontSize: "0.9rem" }}>{title}</h4>
      <h2 style={{ margin: "0.5rem 0", fontSize: "1.8rem" }}>{value}</h2>
      {subtitle && <p style={{ margin: 0, color: "#888", fontSize: "0.8rem" }}>{subtitle}</p>}
    </div>
  );
}
