import { useState } from "react";
import api from "../services/api";

export default function Assistant({ datasetId }) {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const askQuestion = async (e) => {
    e.preventDefault();
    if (!question.trim() || !datasetId) return;

    const userMsg = { role: "user", text: question };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await api.post(`/api/datasets/${datasetId}/assistant`, { question });
      const botMsg = { role: "bot", text: res.data.answer, source: res.data.source };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      const botMsg = { role: "bot", text: err.response?.data?.detail || err.message, source: "error" };
      setMessages(prev => [...prev, botMsg]);
    } finally {
      setLoading(false);
      setQuestion("");
    }
  };

  const suggestions = [
    "What is the total revenue?",
    "How many orders do we have?",
    "What is the average order value?",
  ];

  if (!datasetId) {
    return (
      <div style={{ maxWidth: '800px' }}>
        <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Local AI Assistant (Ollama)</h1>
        <p style={{ color: '#475569', marginBottom: '2rem' }}>Answers grounded in computed metrics</p>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          padding: '3rem 2rem',
          textAlign: 'center',
        }}>
          <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem', color: '#0f172a' }}>No Dataset Uploaded</h3>
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Upload a CSV file to use the AI assistant</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "800px" }}>
      <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Local AI Assistant (Ollama)</h1>
      <p style={{ color: '#475569', marginBottom: '1.5rem' }}>Dataset ID: {datasetId} - Answers grounded in computed metrics</p>

      <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        {suggestions.map((s, idx) => (
          <button key={idx} onClick={() => setQuestion(s)} style={{ padding: "0.5rem 1rem" }}>
            {s}
          </button>
        ))}
      </div>

      <div style={{
        marginTop: "2rem",
        border: "1px solid #ddd",
        borderRadius: "8px",
        height: "400px",
        overflowY: "auto",
        padding: "1rem",
        background: "#fafafa"
      }}>
        {messages.length === 0 && <p style={{ color: "#666" }}>Ask a question about your sales data...</p>}
        {messages.map((m, idx) => (
          <div key={idx} style={{
            marginBottom: "1rem",
            textAlign: m.role === "user" ? "right" : "left"
          }}>
            <div style={{
              display: "inline-block",
              padding: "0.75rem 1rem",
              background: m.role === "user" ? "#007bff" : "#e9ecef",
              color: m.role === "user" ? "#fff" : "#000",
              borderRadius: "8px",
              maxWidth: "70%"
            }}>
              {m.text}
              {m.source && <div style={{ fontSize: "0.7rem", marginTop: "0.25rem", opacity: 0.7 }}>Source: {m.source}</div>}
            </div>
          </div>
        ))}
        {loading && <div style={{ textAlign: "left", color: "#666" }}>Thinking...</div>}
      </div>

      <form onSubmit={askQuestion} style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a question..."
          style={{ flex: 1, padding: "0.75rem" }}
        />
        <button type="submit" disabled={loading} style={{ padding: "0.75rem 1.5rem" }}>
          Ask
        </button>
      </form>
    </div>
  );
}
