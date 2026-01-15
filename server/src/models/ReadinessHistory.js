const mongoose = require("mongoose");

const readinessHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  score: Number,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("ReadinessHistory", readinessHistorySchema);
