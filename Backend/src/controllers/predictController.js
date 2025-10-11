//src/controllers/predictController.js
const axios = require("axios");
const History = require("../models/QueryHistory");
require("dotenv").config();

const predictDisease = async (req, res) => {
  const { message, mode } = req.body;

  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "Invalid message input" });
  }
  if (!mode || !["predict", "chat"].includes(mode)) {
    return res.status(400).json({ error: "Invalid mode; use 'predict' or 'chat'" });
  }

  try {
    const fastapiURL = process.env.FASTAPI_URL || "http://localhost:8000";

    const response = await axios.post(`${fastapiURL}/chat`, {
      mode,
      text: message,
    });

    const prediction = response.data;

    // Save to QueryHistory only for predict mode
    if (mode === "predict") {
      await History.create({
        userId: req.user.id,
        message,
        extracted_symptoms: prediction.extracted_symptoms,
        structured_prediction: prediction.structured_prediction,
        humanized_response: prediction.humanized_response,
      });
    }

    // Return the appropriate response based on mode
    if (mode === "predict") {
      res.json({
        humanized_response: prediction.humanized_response,
        structured_prediction: prediction.structured_prediction,
        extracted_symptoms: prediction.extracted_symptoms,
      });
    } else if (mode === "chat") {
      res.json({
        chat_response: prediction.chat_response,
      });
    }
  } catch (err) {
    console.error("Prediction error:", err.message);
    res.status(500).json({ error: "Prediction failed" });
  }
};

module.exports = { predictDisease };