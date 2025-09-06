// src/routes/predictRoutes.js
const express = require("express");
const { predictDisease } = require("../controllers/predictController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, predictDisease);

module.exports = router;
