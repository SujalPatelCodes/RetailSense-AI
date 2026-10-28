import { useState } from "react";
import api from "../services/api";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResult(null);
    setError(null);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a CSV file");
      return;
    }
    setUploading(true);
    setError(null);
    setResult(null);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await api.post("/api/datasets/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(res.data);
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || "Upload failed";
      setError(msg);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h1>CSV Upload & Data Cleaning</h1>
      <p>Upload sales CSV. Required: order_id, order_date, quantity, unit_price (others optional).</p>
      <form onSubmit={handleUpload} style={{ marginTop: "1.5rem" }}>
        <input type="file" accept=".csv" onChange={handleFileChange} />
        <button type="submit" disabled={uploading || !file} style={{ marginLeft: "1rem" }}>
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </form>
      {error && <div style={{ marginTop: "1rem", padding: "1rem", background: "#fee", color: "#c33" }}>{error}</div>}
      {result && (
        <div style={{ marginTop: "1rem", padding: "1rem", background: "#efe", color: "#363" }}>
          <h3>Success</h3>
          <p><strong>Dataset ID:</strong> {result.dataset_id}</p>
          <p><strong>Rows:</strong> {result.rows}</p>
          <p><strong>Status:</strong> {result.status}</p>
          <p><strong>Columns:</strong> {result.columns.join(", ")}</p>
          <p>{result.message}</p>
        </div>
      )}
    </div>
  );
}
