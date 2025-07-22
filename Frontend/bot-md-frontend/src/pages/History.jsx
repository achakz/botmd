// src/pages/History.jsx
import React, { useEffect, useState } from "react";
import { getMockHistory } from "../services/api";
import { speak } from "../components/TTSPlayer";

const History = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getMockHistory();
      setHistory(data);
    };
    fetchData();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>🕓 Consultation History</h2>
      {history.length === 0 ? (
        <p>No history available.</p>
      ) : (
        history.map((item, idx) => (
          <div
            key={idx}
            style={{
              marginBottom: "1.5rem",
              borderBottom: "1px solid #ccc",
              paddingBottom: "1rem",
            }}
          >
            <p><strong>Date:</strong> {new Date(item.timestamp).toLocaleString()}</p>
            <p><strong>Symptoms:</strong> {item.symptoms.join(", ")}</p>
            <ul>
              {item.results.map((res, i) => (
                <li key={i}>
                  <p>
                    🦠 <strong>{res.disease}</strong> — Confidence: {(res.score * 100).toFixed(1)}% <br />
                    📝 {res.description} <br />
                    ⚠️ Severity: <strong>{res.severity}</strong>
                  </p>
                </li>
              ))}
            </ul>
            <button onClick={() => {
              const spoken = `Based on symptoms like ${item.symptoms.join(", ")}, you may have ${item.results.map(r => r.disease).join(" or ")}`;
              speak(spoken);
            }}>
              🔊 Speak Diagnosis
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default History;
