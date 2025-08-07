// src/components/ChatBot.jsx
import React, { useState, useEffect } from "react";
import MessageBubble from "./MessageBubble";
import { speak } from "./TTSPlayer";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  createChatSession,
  getUserChatSessions,
  addChatMessage,
  getMessagesBySession,
} from "../services/api";
import axios from "axios";

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [ttsEnabled, setTTSEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [mode, setMode] = useState("predict");

  const { user } = useAuth();
  const navigate = useNavigate();

  // 🔁 Load last session + messages
  useEffect(() => {
    const initSession = async () => {
      if (!user?.token) return;
      const sessions = await getUserChatSessions(user.token);
      if (sessions.length > 0) {
        const last = sessions[0];
        setSessionId(last._id);
        const msgs = await getMessagesBySession(user.token, last._id);
        setMessages(msgs);
      } else {
        // No sessions yet → create first
        const newSession = await createChatSession(user.token, "New Chat");
        setSessionId(newSession._id);
        setMessages([]);
      }
    };
    initSession();
  }, [user?.token]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      sender: "user",
      content: input,
      mode,
    };

    setMessages((prev) => [...prev, userMessage]);
    await addChatMessage(user.token, { ...userMessage, sessionId });

    setLoading(true);

    try {
      const symptoms = input.split(",").map((s) => s.trim().toLowerCase());

      const res = await axios.post(
        "http://localhost:5000/api/predict",
        { symptoms },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
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

      const botMessage = {
        sender: "bot",
        content: botText,
        mode,
      };

      setMessages((prev) => [...prev, botMessage]);
      await addChatMessage(user.token, { ...botMessage, sessionId });

      if (ttsEnabled) {
        speak(`You may have ${diseases.map((d) => d.disease).join(" or ")}`);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Prediction failed";
      const botMessage = {
        sender: "bot",
        content: `❌ ${errorMsg}`,
        mode,
      };
      setMessages((prev) => [...prev, botMessage]);
      await addChatMessage(user.token, { ...botMessage, sessionId });
    }

    setInput("");
    setLoading(false);
  };

  const handleNewChat = async () => {
    const newSession = await createChatSession(user.token, `Chat on ${new Date().toLocaleString()}`);
    setSessionId(newSession._id);
    setMessages([]);
  };

  return (
    <div className="chat-container">
      {/* 🔝 Header */}
      <div className="chat-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px" }}>
        <h2>🤖 BotMD</h2>
        <div>
          <select value={mode} onChange={(e) => setMode(e.target.value)} style={{ marginRight: "10px" }}>
            <option value="predict">Prediction Mode</option>
            <option value="chat">Chat Mode</option>
          </select>
          <button onClick={() => setTTSEnabled((prev) => !prev)}>
            {ttsEnabled ? "🔊 TTS On" : "🔇 TTS Off"}
          </button>
          <button onClick={handleNewChat} style={{ marginLeft: "8px" }}>
            ➕ New Chat
          </button>
          <button onClick={() => navigate("/history")} style={{ marginLeft: "8px" }}>
            📜 View History
          </button>
        </div>
      </div>

      {/* 💬 Messages */}
      <div className="messages" style={{ flexGrow: 1, overflowY: "auto", padding: "10px" }}>
        {messages.map((msg, i) => (
          <MessageBubble key={i} from={msg.sender} text={msg.content} />
        ))}
        {loading && <MessageBubble from="bot" text="⏳ Predicting..." />}
      </div>

      {/* 📝 Input */}
      <div className="input-area" style={{ display: "flex", padding: "10px", borderTop: "1px solid #ccc" }}>
        <input
          type="text"
          placeholder="Enter your symptoms or message..."
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
