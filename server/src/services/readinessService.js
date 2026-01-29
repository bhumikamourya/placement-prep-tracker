const ReadinessHistory = require("../models/ReadinessHistory");
const { getStartOfToday, getEndOfToday } = require("../utils/date");

exports.saveReadinessSnapshot = async (userId, score) => {
  const start = getStartOfToday();
  const end = getEndOfToday();

  await ReadinessHistory.findOneAndUpdate(
    {
      userId,
      date: { $gte: start, $lte: end }
    },
    {
      userId,
      score,
      date: start
    },
    {
      upsert: true,
      new: true
    });
};   
