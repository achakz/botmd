// src/controllers/chatSessionController.js
const ChatSession = require("../models/ChatSession");
const ChatMessage = require("../models/ChatMessage");

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

const deleteSession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    // Ensure the session belongs to the authenticated user
    const session = await ChatSession.findOne({ _id: sessionId, userId: req.user.id });
    if (!session) {
      return res.status(404).json({ error: "Session not found or not authorized" });
    }

    // Delete all messages belonging to this session
    await ChatMessage.deleteMany({ sessionId });

    // Delete the session itself
    await ChatSession.deleteOne({ _id: sessionId });

    res.json({ message: "Session and associated messages deleted successfully" });
  } catch (err) {
    console.error("Error deleting session:", err);
    res.status(500).json({ error: "Error deleting session" });
  }
};

module.exports = {
  createSession,
  getUserSessions,
  deleteSession,
};
