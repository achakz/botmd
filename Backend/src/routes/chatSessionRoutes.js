// src/routes/chatSessionRoutes.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const { createSession, getUserSessions } = require("../controllers/chatSessionController");

router.post("/", authMiddleware, createSession);
router.get("/", authMiddleware, getUserSessions);

module.exports = router;
