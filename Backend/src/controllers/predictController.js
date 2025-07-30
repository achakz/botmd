const axios = require("axios");
const History = require("../models/QueryHistory");
const redis = require("../utils/redisClient");

const predictDisease = async (req, res) => {
  const { symptoms } = req.body;

  if (!symptoms || !Array.isArray(symptoms)) {
    return res.status(400).json({ error: "Invalid symptoms input" });
  }

  const key = symptoms.map(s => s.toLowerCase().trim()).sort().join(",");

  try {
    const cached = await redis.get(key);
    let results;

    if (cached) {
      console.log("Returning from Redis cache");
      return res.json(JSON.parse(cached));
    } else {
      const response = await axios.post("http://localhost:8000/predict", {
        symptoms,
      });

      results = response.data.results;

      await redis.set(key, JSON.stringify({ results }), "EX", 3600);
      console.log("Cached new prediction result");
    }

    // Save to MongoDB
    await History.create({
      userId: req.user.id,
      symptoms,
      results,
    });

    res.json({ results });
  } catch (err) {
    console.error("Prediction error:", err.message);
    res.status(500).json({ error: "Prediction failed" });
  }
};

module.exports = { predictDisease };
