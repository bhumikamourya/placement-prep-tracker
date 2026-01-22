const Skill = require("../models/skill");
const StudyPlan = require("../models/StudyPlan");
const MockTest = require("../models/MockTest");
const ReadinessHistory = require("../models/ReadinessHistory");
const roleSkillsMap = require("../utils/roleSkillsMap");
const { calculateReadiness } = require("../utils/scoreCalculator");

exports.getDashboardSummary = async (userId) => {
    const skills = await Skill.find({ userId });
    const plans = await StudyPlan.find({ userId });
    const mocks = await MockTest.find({ userId });
    
    const totalSkills = skills.length;
    const weakSkills = skills.filter(s => s.status < 2).length;

    let totalTasks = 0;
    let completedTasks = 0;

    plans.forEach(plan => {
        totalTasks += plan.tasks.length;
        completedTasks += plan.tasks.filter(t => t.status === "DONE").length;
    });
    const pendingTasks = totalTasks - completedTasks;

    const readinessScore = calculateReadiness(skills, mocks);

    const latestReadiness = await ReadinessHistory.findOne({ userId }).sort({ date: -1 });

    return {
        totalSkills,
        weakSkills,
        totalTasks,
        completedTasks,
        pendingTasks,
        readinessScore,
        lastReadinessScore: latestReadiness?.score ?? readinessScore
    };
};