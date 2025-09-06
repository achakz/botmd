//src/models/QueryHistory.js
const mongoose = require("mongoose");

const queryHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  extracted_symptoms: {
    type: [String],
    required: true,
  },
  structured_prediction: {
    type: [
      {
        disease: { type: String, required: true },
        score: { type: Number, required: true },
      },
    ],
    required: true,
  },
  humanized_response: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("queryHistory", queryHistorySchema);