const PerformanceSnapshot = require("../models/PerformanceSnapshot");
const {getStartOfDaysAgo} = require("../utils/date");

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

exports.getWeeklyPerformance = async(req, res)=>{
    try{
        const userId = req.user.id;

        //last 7 days from today
        const startDate = getStartOfDaysAgo(6);
        const snapshots = await PerformanceSnapshot.find({
            userId,
            date :{$gte : startDate}
        }).sort({date: 1}).select("date completionRate avgReadinessScore streak-_id") // older first

        res.json(snapshots);
    }catch(err){
        console.log(err);
        res.status(500).json({message : "Failedd to fetch weekly performance"});
    }
};