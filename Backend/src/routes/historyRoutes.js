// src/routes/historyRoutes.js

const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const { getHistory } = require("../controllers/historyController");

const router = express.Router();

// 🔐 Protected route
router.get("/", authMiddleware, getHistory);

module.exports = router;
