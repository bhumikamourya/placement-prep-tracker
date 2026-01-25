const PerformanceSnapshot = require("../models/PerformanceSnapshot");
const StudyPlan = require("../models/StudyPlan");
const ReadinessHistory = require("../models/ReadinessHistory");
const { evaluateSkillStrength } = require("./skillStrengthEvaluator");

exports.saveDailyPerformance = async (userId) => {
    const today = new Date().toISOString().split("T")[0];

    const start = new Date(today);
    const end = new Date(today);
    end.setHours(23, 59, 59, 999);

    const plan = await StudyPlan.findOne({ userId, date: today });
    if (!plan) return;

    const tasksAssigned = plan.tasks.length;
    const tasksCompleted = plan.tasks.filter(t => t.status === "DONE").length;

    const readiness = await ReadinessHistory.findOne({
        userId,
        date: { $gte: start, $lte: end }
    });

    const completionRate =
        tasksAssigned === 0 ? 0 : Math.round((tasksCompleted / tasksAssigned) * 100);

    await PerformanceSnapshot.findOneAndUpdate(
        { userId, date: { $gte: start, $lte: end } },
        {
            userId,
            tasksAssigned,
            tasksCompleted,
            completionRate,
            avgReadinessScore: readiness?.score || 0,
            date: new Date()
        },
        { upsert: true, new: true }
    );

    await evaluateSkillStrength(userId);
};
