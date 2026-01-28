const PerformanceSnapshot = require("../models/PerformanceSnapshot");
const StudyPlan = require("../models/StudyPlan");
const ReadinessHistory = require("../models/ReadinessHistory");
const { evaluateSkillStrength } = require("./skillStrengthEvaluator");
const {getStartOfToday, getEndOfToday} = require("../utils/date");

exports.saveDailyPerformance = async (userId) => {
    const start = getStartOfToday();
    const end = getEndOfToday();

    const plan = await StudyPlan.findOne({ userId, date: start });
    if (!plan) return;

    const tasksAssigned = plan.tasks.length;
    const tasksCompleted = plan.tasks.filter(t => t.status === "DONE").length;

    const readiness = await ReadinessHistory.findOne({
        userId,
        date: { $gte: start, $lte: end }
    });

    const completionRate =
        tasksAssigned === 0 ? 0 : Math.round((tasksCompleted / tasksAssigned) * 100);

        //streak calculation
        const yesterday = new Date(start);
        yesterday.setDate(yesterday.getDate() - 1);

        const yesterdaySnapshot = await PerformanceSnapshot.findOne({
            userId, 
            date : yesterday
        });

        let streak = 1;
        if(yesterdaySnapshot && yesterdaySnapshot.completionRate >= 50){
            streak = yesterdaySnapshot.streak +1;
        }

    await PerformanceSnapshot.findOneAndUpdate(
        { userId, date: start },
        {
            userId,
            date : start,
            tasksAssigned,
            tasksCompleted,
            completionRate,
            avgReadinessScore: readiness?.score || 0,
            streak
        },
        { upsert: true, new: true }
    );

    await evaluateSkillStrength(userId);
};
