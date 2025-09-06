//src/controllers/historyController.js
const History = require("../models/QueryHistory");

const getHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const history = await History.find({ userId }).sort({ createdAt: -1 });

    res.json(history);
  } catch (err) {
    res.status(500).json({ error: "Could not fetch history" });
  }
};

module.exports = { getHistory };
