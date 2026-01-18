const PerformanceSnapshot = require("../models/PerformanceSnapshot");
exports.getPerformanceAnalytics = async (req, res)=>{
    const data = await PerformanceSnapshot
    .find({userId : req.user.id})
    .sort({date  : 1});
    res.json(data);
};