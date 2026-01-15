const ReadinessHistory = require("../models/ReadinessHistory");

exports.saveReadinessSnapshot = async (userId, score) => {
  const today = new Date();
  today.setHours(0,0,0,0);

  const end = new Date();
  end.setHours(23, 59, 59, 999);

  const exists = await ReadinessHistory.findOne({
    userId,
    date: {$gte: today, $lte: end }
  });

  if (!exists) {
    await ReadinessHistory.create({ userId, score });
  } 
};   
