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
      // Mocked result (replace later with AI service call)
      results = [
        {
          disease: "Flu",
          score: 0.76,
          description: "A common viral infection causing fever and fatigue.",
          severity: "Medium",
        },
        {
          disease: "Common Cold",
          score: 0.58,
          description: "A mild viral respiratory illness.",
          severity: "Low",
        },
        {
          disease: "COVID-19",
          score: 0.43,
          description: "A potentially serious respiratory illness caused by coronavirus.",
          severity: "High",
        },
      ];

      await redis.set(key, JSON.stringify({ results }), "EX", 3600);
      console.log("Cached new prediction result");
    }

    // Save to MongoDB
    await History.create({
      userId: req.user.id, // coming from authMiddleware
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
