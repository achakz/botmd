// src/routes/chatMessageRoutes.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const { addMessage, getMessagesBySession } = require("../controllers/chatMessageController");

router.post("/", authMiddleware, addMessage);
router.get("/:sessionId", authMiddleware, getMessagesBySession);

module.exports = router;
