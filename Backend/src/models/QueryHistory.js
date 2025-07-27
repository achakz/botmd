const mongoose = require("mongoose");

const queryHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  symptoms: {
    type: [String],
    required: true,
  },
  results: {
    type: [
      {
        disease: String,
        score: Number,
        description: String,
        severity: String,
      },
    ],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("queryHistory", queryHistorySchema);
