// src/routes/chatSessionRoutes.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const { createSession, getUserSessions, deleteSession } = require("../controllers/chatSessionController");

router.post("/", authMiddleware, createSession);
router.get("/", authMiddleware, getUserSessions);
router.delete("/:sessionId", authMiddleware, deleteSession);

module.exports = router;
