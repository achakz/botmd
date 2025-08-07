//src/components/MessageBubble.jsx
import React from "react";

const MessageBubble = ({ from, text }) => {
  const isUser = from === "user";
  return (
    <div
      className={`bubble ${isUser ? "user-bubble" : "bot-bubble"}`}
      style={{
        alignSelf: isUser ? "flex-end" : "flex-start",
        background: isUser ? "#007bff" : "#eee",
        color: isUser ? "white" : "black",
        borderRadius: "12px",
        padding: "8px 12px",
        margin: "6px",
        maxWidth: "70%",
      }}
    >
      {text}
    </div>
  );
};

export default MessageBubble;
