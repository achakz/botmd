// src/controllers/historyController.js

// const { PrismaClient } = require("@prisma/client");
// const prisma = new PrismaClient();
const QueryHistory = require("../models/QueryHistory"); // Assuming you have a QueryHistory model

const getHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const history = await QueryHistory.find({ userId }).sort({ createdAt: -1 });

    res.json(history);
  } catch (err) {
    res.status(500).json({ error: "Could not fetch history" });
  }
};

module.exports = { getHistory };
