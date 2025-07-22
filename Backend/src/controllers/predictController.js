const redis = require("../utils/redisClient");

const predictDisease = async (req, res) => {
  const { symptoms } = req.body;

  if (!symptoms || !Array.isArray(symptoms)) {
    return res.status(400).json({ error: "Invalid symptoms input" });
  }

  const key = symptoms.map(s => s.toLowerCase().trim()).sort().join(",");

  try {
    // 1. Try cache first
    const cached = await redis.get(key);
    if (cached) {
      console.log("Returning from Redis cache");
      return res.json(JSON.parse(cached));
    }

    // 2. Mock prediction (for now)
    const mockResult = {
      results: [
        {
          disease: "Flu",
          score: 0.76,
          description: "A common viral infection causing fever and fatigue.",
          severity: "Medium"
        },
        {
          disease: "Common Cold",
          score: 0.58,
          description: "A mild viral respiratory illness.",
          severity: "Low"
        },
        {
          disease: "COVID-19",
          score: 0.43,
          description: "A potentially serious respiratory illness caused by coronavirus.",
          severity: "High"
        }
      ]
    };

    // 3. Save to Redis (TTL = 1 hour)
    await redis.set(key, JSON.stringify(mockResult), "EX", 3600);

    // // 🧠 2. Query AI microservice
    // const response = await axios.post("http://model:8000/predict", { symptoms });

    // // ✅ 3. Cache the result
    // await redis.set(key, JSON.stringify(response.data), "EX", 3600); // 1 hr TTL

    console.log("Cached new prediction result");
    res.json(mockResult);
  } catch (err) {
    console.error("Prediction error:", err.message);
    res.status(500).json({ error: "Prediction failed" });
  }
};

module.exports = { predictDisease };
