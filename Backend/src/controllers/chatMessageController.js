// src/controllers/chatMessageController.js
const ChatMessage = require("../models/ChatMessage");

const addMessage = async (req, res) => {
  try {
    const { sessionId, sender, content, mode } = req.body;

    const message = await ChatMessage.create({
      sessionId,
      sender,
      content,
      mode,
    });

    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: "Error saving message" });
  }
};

const getMessagesBySession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const messages = await ChatMessage.find({ sessionId }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Error fetching messages" });
  }
};

module.exports = {
  addMessage,
  getMessagesBySession,
};
