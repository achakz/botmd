// src/controllers/chatSessionController.js
const ChatSession = require("../models/ChatSession");

const createSession = async (req, res) => {
  try {
    const { title } = req.body;
    const session = await ChatSession.create({
      userId: req.user.id,
      title,
    });
    res.status(201).json(session);
  } catch (err) {
    res.status(500).json({ error: "Error creating session" });
  }
};

const getUserSessions = async (req, res) => {
  try {
    const sessions = await ChatSession.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: "Error fetching sessions" });
  }
};

module.exports = {
  createSession,
  getUserSessions,
};
