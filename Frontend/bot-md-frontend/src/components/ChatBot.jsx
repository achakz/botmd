// src/components/ChatBot.jsx
import React, { useState } from "react";
import MessageBubble from "./MessageBubble";
import { speak } from "./TTSPlayer";

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { from: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    // Temporary mock bot response (will connect to backend later)
    const botResponse = {
      from: "bot",
      text: `You might be experiencing Flu or Common Cold.`,
    };
    setMessages((prev) => [...prev, botResponse]);

    // Text-to-Speech (optional at this point)
    speak(botResponse.text);

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
