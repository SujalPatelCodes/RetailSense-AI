import { useState } from "react";
import api from "../services/api";
import { MessageSquare, Send, Bot, User, Sparkles } from "lucide-react";

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
    "What are my best-selling products?",
  ];

  if (!datasetId) {
    return (
      <div style={{ maxWidth: '800px' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.375rem', color: '#0f172a' }}>AI Assistant</h2>
          <p style={{ color: '#475569', fontSize: '0.875rem', margin: 0 }}>Get insights powered by your data</p>
        </div>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          padding: '3rem 2rem',
          textAlign: 'center',
        }}>
          <MessageSquare size={48} style={{ color: '#cbd5e1', margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem', color: '#0f172a' }}>No Dataset Uploaded</h3>
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Upload a CSV file to use the AI assistant</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "800px" }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.375rem', color: '#0f172a' }}>AI Assistant</h2>
        <p style={{ color: '#475569', fontSize: '0.875rem', margin: 0 }}>Dataset ID: {datasetId} • Answers grounded in computed metrics</p>
      </div>

      {messages.length === 0 && (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          padding: '2rem',
          marginBottom: '1.5rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Sparkles size={20} style={{ color: '#6366f1' }} />
            <h3 style={{ fontSize: '1rem', color: '#0f172a', margin: 0 }}>Suggested Questions</h3>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {suggestions.map((s, idx) => (
              <button
                key={idx}
                onClick={() => setQuestion(s)}
                style={{
                  padding: '0.5rem 0.875rem',
                  backgroundColor: '#f8fafc',
                  color: '#475569',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '0.8125rem',
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        marginBottom: '1rem',
      }}>
        <div style={{
          height: '400px',
          overflowY: 'auto',
          padding: '1.5rem',
        }}>
          {messages.length === 0 && (
            <div style={{ textAlign: 'center', color: '#94a3b8', paddingTop: '2rem' }}>
              <MessageSquare size={32} style={{ margin: '0 auto 0.75rem', color: '#cbd5e1' }} />
              <p style={{ fontSize: '0.875rem' }}>Ask a question about your sales data...</p>
            </div>
          )}
          {messages.map((m, idx) => (
            <div key={idx} style={{
              marginBottom: '1.25rem',
              display: 'flex',
              gap: '0.75rem',
              justifyContent: m.role === "user" ? "flex-end" : "flex-start"
            }}>
              {m.role === "bot" && (
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: '#eef2ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Bot size={18} style={{ color: '#6366f1' }} />
                </div>
              )}
              <div style={{ maxWidth: '70%' }}>
                <div style={{
                  padding: '0.75rem 1rem',
                  backgroundColor: m.role === "user" ? '#6366f1' : '#f8fafc',
                  color: m.role === "user" ? 'white' : '#0f172a',
                  borderRadius: m.role === "user" ? '12px 12px 4px 12px' : '12px 12px 12px 4px',
                  fontSize: '0.875rem',
                  lineHeight: '1.6',
                  whiteSpace: 'pre-wrap',
                }}>
                  {m.text}
                </div>
                {m.source && (
                  <p style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.375rem', textAlign: m.role === "user" ? "right" : "left" }}>
                    Source: {m.source}
                  </p>
                )}
              </div>
              {m.role === "user" && (
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: '#e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <User size={18} style={{ color: '#475569' }} />
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#eef2ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Bot size={18} style={{ color: '#6366f1' }} />
              </div>
              <div style={{ padding: '0.75rem 1rem', backgroundColor: '#f8fafc', borderRadius: '12px 12px 12px 4px', color: '#64748b', fontSize: '0.875rem' }}>
                Thinking...
              </div>
            </div>
          )}
        </div>
      </div>

      <form onSubmit={askQuestion} style={{
        display: 'flex',
        gap: '0.75rem',
        backgroundColor: 'white',
        padding: '0.75rem',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      }}>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a question about your data..."
          style={{
            flex: 1,
            padding: '0.625rem 0.875rem',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            fontSize: '0.875rem',
            outline: 'none',
          }}
        />
        <button
          type="submit"
          disabled={loading || !question.trim()}
          style={{
            padding: '0.625rem 1.25rem',
            backgroundColor: loading || !question.trim() ? '#cbd5e1' : '#6366f1',
            color: 'white',
            borderRadius: '8px',
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.375rem',
            border: 'none',
          }}
        >
          <Send size={16} />
          Send
        </button>
      </form>
    </div>
  );
}
