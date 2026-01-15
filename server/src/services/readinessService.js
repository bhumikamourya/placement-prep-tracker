const ReadinessHistory = require("../models/ReadinessHistory");

exports.saveReadinessSnapshot = async (userId, score) => {
  const today = new Date();
  today.setHours(0,0,0,0);

  const exists = await ReadinessHistory.findOne({
    userId,
    date: { $gte: today }
  });

  if (!exists) {
    await ReadinessHistory.create({ userId, score });
  }
};   
