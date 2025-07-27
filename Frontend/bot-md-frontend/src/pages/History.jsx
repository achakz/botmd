import React, { useEffect, useState } from "react";
import { getUserHistory } from "../services/api"; // ✅ real call
import { useAuth } from "../context/AuthContext"; // ✅ get token
import { speak } from "../components/TTSPlayer";

const History = () => {
  const [history, setHistory] = useState([]);
  const { user } = useAuth(); // 🔐 access stored token

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
            <p><strong>Date:</strong> {new Date(item.createdAt).toLocaleString()}</p>
            <p><strong>Symptoms:</strong> {item.symptoms}</p>
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
              const spoken = `Based on symptoms like ${item.symptoms}, you may have ${item.results.map(r => r.disease).join(" or ")}`;
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
