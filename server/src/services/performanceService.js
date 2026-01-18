const PerformanceSnapshot = require("../models/PerformanceSnapshot");
const StudyPlan = require("../models/StudyPlan");
const ReadinessHistory = require("../models/ReadinessHistory");

exports.saveDailyPerformance = async(userId) =>{
    const today = new Date().toISOString().split("T")[0];

    //fetch today's study plan
    const plan = await StudyPlan.findOne({
        userId,
        date : today
    });
    if(!plan) return;

    const tasksAssigned = plan.tasks.length;
    const tasksCompleted = plan.tasks.filter(t =>t.status === "DONE").length;

    const readiness = await ReadinessHistory.findOne({
        userId,
        date : {$gte : new Date(today)}
    });

    const completionRate = tasksAssigned === 0 ? 0 : Math.round((tasksCompleted/ tasksAssigned)*100);
    await PerformanceSnapshot.create({
        userId, 
        tasksAssigned,
        tasksCompleted,
        completionRate,
        avgReadinessScore : readiness?.score || 0
    });
};