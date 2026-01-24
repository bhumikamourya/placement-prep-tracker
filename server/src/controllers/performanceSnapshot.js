const PerformanceSnapshot = require("../models/PerformanceSnapshot");
exports.getPerformanceAnalytics = async (req, res)=>{
    try{
    const data = await PerformanceSnapshot
    .find({userId : req.user.id})
    .sort({date  : 1});
    res.json(data);
    }catch(err){
        res.status(500).json({message : "Server Error", error : err.message});
    }
};