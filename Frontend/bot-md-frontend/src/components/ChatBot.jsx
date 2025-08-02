import React, { useState } from "react";
import MessageBubble from "./MessageBubble";
import { speak } from "./TTSPlayer";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [ttsEnabled, setTTSEnabled] = useState(true);
  const [loading, setLoading] = useState(false); // ⏳ loader state

  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { from: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true); // Start loader

    try {
      const symptoms = input.split(",").map((s) => s.trim().toLowerCase());

      const res = await axios.post(
        "http://localhost:5000/api/predict",
        { symptoms },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      const diseases = res.data.results;

      const botText = diseases
        .map(
          (d) =>
            `🦠 ${d.disease} (${(d.score * 100).toFixed(1)}%) - ${d.severity}`
        )
        .join("\n");

      const botMessage = { from: "bot", text: botText };
      setMessages((prev) => [...prev, botMessage]);

      if (ttsEnabled) {
        speak(`You may have ${diseases.map((d) => d.disease).join(" or ")}`);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Prediction failed";
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: `❌ ${errorMsg}` },
      ]);
    }

    setLoading(false); // Stop loader
    setInput("");
  };

  return (
    <div className="chat-container">
      {/* 🔝 Top bar */}
      <div
        className="chat-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "8px",
        }}
      >
        <h2>🤖 BotMD</h2>
        <div>
          <button onClick={() => setTTSEnabled((prev) => !prev)}>
            {ttsEnabled ? "🔊 TTS On" : "🔇 TTS Off"}
          </button>
          <button
            onClick={() => navigate("/history")}
            style={{ marginLeft: "8px" }}
          >
            📜 View History
          </button>
        </div>
      </div>

      {/* 💬 Chat messages */}
      <div
        className="messages"
        style={{ flexGrow: 1, overflowY: "auto", padding: "10px" }}
      >
        {messages.map((msg, i) => (
          <MessageBubble key={i} from={msg.from} text={msg.text} />
        ))}
        {loading && (
          <MessageBubble from="bot" text="⏳ Predicting..." />
        )}
      </div>

      {/* 📝 Input area */}
      <div
        className="input-area"
        style={{
          display: "flex",
          padding: "10px",
          borderTop: "1px solid #ccc",
        }}
      >
        <input
          type="text"
          placeholder="Enter your symptoms..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ flexGrow: 1, marginRight: "10px", padding: "8px" }}
          disabled={loading}
        />
        <button onClick={handleSend} disabled={loading}>
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default ChatBot;
