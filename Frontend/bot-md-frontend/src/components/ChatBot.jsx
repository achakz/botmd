// src/components/ChatBot.jsx
import React, { useState } from "react";
import MessageBubble from "./MessageBubble";
import { speak } from "./TTSPlayer";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const { user } = useAuth();

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { from: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    try {
      // Convert input into symptom array (simple split for now)
      const symptoms = input.split(",").map(s => s.trim().toLowerCase());

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

      const botText = diseases.map(d =>
        `🦠 ${d.disease} (${(d.score * 100).toFixed(1)}%) - ${d.severity}`
      ).join("\n");

      const botMessage = { from: "bot", text: botText };

      setMessages(prev => [...prev, botMessage]);

      speak(`You may have ${diseases.map(d => d.disease).join(" or ")}`);

    } catch (err) {
      const errorMsg = err.response?.data?.error || "Prediction failed";
      setMessages(prev => [...prev, { from: "bot", text: `❌ ${errorMsg}` }]);
    }

    setInput("");
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg, i) => (
          <MessageBubble key={i} from={msg.from} text={msg.text} />
        ))}
      </div>
      <div className="input-area">
        <input
          type="text"
          placeholder="Enter your symptoms..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default ChatBot;
