//src/pages/History.jsx

import React, { useEffect, useState } from "react";
import { getUserHistory } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { speak } from "../components/TTSPlayer";
import { useNavigate } from "react-router-dom";

const History = () => {
  const [history, setHistory] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getUserHistory(user.token);
        setHistory(data);
      } catch (err) {
        console.error("Failed to fetch history:", err.message);
      }
    };
    if (user) fetchData();
  }, [user]);

  return (
    <div style={{ padding: "2rem" }}>
      <button onClick={() => navigate("/chat")} style={{ marginBottom: "1rem" }}>
        🔙 Back to Chat
      </button>

      <h2>🕓 Consultation History</h2>
      {history.length === 0 ? (
        <p>No history available.</p>
      ) : (
        history.map((item, idx) => (
          <div key={idx} style={{ marginBottom: "1.5rem", borderBottom: "1px solid #ccc", paddingBottom: "1rem" }}>
            <p><strong>Date:</strong> {new Date(item.createdAt).toLocaleString()}</p>
            <p><strong>Message:</strong> {item.message}</p>
            <p><strong>Extracted Symptoms:</strong> {item.extracted_symptoms.join(", ")}</p>
            <ul>
              {item.structured_prediction.map((res, i) => (
                <li key={i}>
                  <p>
                    🦠 <strong>{res.disease}</strong> — Confidence: {(res.score * 100).toFixed(1)}% <br />
                  </p>
                </li>
              ))}
            </ul>
            <p><strong>Humanized Response:</strong> {item.humanized_response}</p>
            <button
              onClick={() => {
                const spoken = `Based on your message ${item.message}, you may have ${item.structured_prediction.map((r) => r.disease).join(" or ")}`;
                speak(spoken);
              }}
            >
              🔊 Speak Diagnosis
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default History;