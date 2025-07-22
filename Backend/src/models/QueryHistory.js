const mongoose = require("mongoose");

const queryHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  symptoms: String,
  result: String,
}, { timestamps: true });

module.exports = mongoose.model("QueryHistory", queryHistorySchema);
