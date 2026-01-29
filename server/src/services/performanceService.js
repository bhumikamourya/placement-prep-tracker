const PerformanceSnapshot = require("../models/PerformanceSnapshot");
const StudyPlan = require("../models/StudyPlan");
const ReadinessHistory = require("../models/ReadinessHistory");
const { evaluateSkillStrength } = require("./skillStrengthEvaluator");
const { getStartOfToday, getEndOfToday, getStartOfDaysAgo } = require("../utils/date");

//analytics- all time
const getPerformanceAnalyticsService = async (userId) => {
    return await PerformanceSnapshot.find({ userId }).sort({ date: 1 });
}

//weekly
const getWeeklyPerformanceService = async (userId) => {
    const startDate = getStartOfDaysAgo(6);

    return await PerformanceSnapshot.find({
        userId,
        date: { $gte: startDate }
    }).sort({ date: 1 }).select("date completionRate avgReadinessScore streak -_id");
};

//daily snapshot
const saveDailyPerformance = async (userId) => {
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

    //streak calculation - using range query
    const yesterdayStart = getStartOfDaysAgo(1);
    const yesterdayEnd = getEndOfToday(yesterdayStart);

    const yesterdaySnapshot = await PerformanceSnapshot.findOne({
        userId,
        date: { $gte: yesterdayStart, $lte: yesterdayEnd }
    });


    let streak = 1;
    if (yesterdaySnapshot && yesterdaySnapshot.completionRate >= 50) {
        streak = yesterdaySnapshot.streak + 1;
    }

    await PerformanceSnapshot.findOneAndUpdate(
        { userId, date: start },
        {
            userId,
            date: start,
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

module.exports = { getPerformanceAnalyticsService, getWeeklyPerformanceService, saveDailyPerformance };
