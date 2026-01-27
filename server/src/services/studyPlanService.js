const StudyPlan = require("../models/StudyPlan");
const MockTest = require("../models/MockTest");
const { getTopSkillGaps } = require("./skillGapService");
const { getStartOfToday } = require("../utils/date");

const DAILY_TIME_LIMIT = 120;

exports.generateDailyStudyPlan = async (userId) => {
    const today = getStartOfToday();

    //prevent duplicate
    const existing = await StudyPlan.findOne({ userId, date: today });
    if (existing) {
        return {
            status: "EXISTS",
            plan: existing
        };
    }

    //fetch gaps
    const gaps = await getTopSkillGaps(userId);
    if (!gaps || gaps.length === 0) {
        return {
            status: "EMPTY",
            decisionReasons: ["No skills found. Add skills to generate study plan."]
        };
    }

    //mock accuracy map
    const mocks = await MockTest.find({ userId });
    const accuracyMap = {};
    mocks.forEach(m => {
        if (m.totalQuestions > 0) {
            accuracyMap[m.topic] = Math.round((m.correctAnswers / m.totalQuestions) * 100);
        }
    });

    // const adjustmentNote = await adjustStudyWeights(userId);
    //const adjustmentNote = null;

    // decision reasons
    const decisionReasons = [];
    gaps.forEach(gap => {
        const accuracy = accuracyMap[gap.topic] ?? "N/A";
        if (gap.status === 0) {
            decisionReasons.push(`${gap.topic} is a weak skill (priority ${gap.priority}, accuracy ${accuracy}%)`);
        } else {
            decisionReasons.push(`${gap.topic} needs revision; (accuracy ${accuracy}%)`);
        }
    });

    //build tasks
    let tasks = gaps.map(gap => {
        const accuracy = accuracyMap[gap.topic] ?? 100;

        let estimatedTime = 20 + (gap.priority * 5); //base + priority scaling

        if (gap.status === 1 && accuracy < 50) {
            estimatedTime += Math.ceil((50 - accuracy) / 2);
        }
        let priority = gap.priority >= 6 ? "HIGH" : "MEDIUM";

        return {
            topic: gap.topic,
            category: gap.category,
            estimatedTime,
            priority,
            status: "PENDING"
        };
    });

    // time balancing
    let used = 0;
    const finalTasks = [];
    for (let task of tasks) {
        if (used + task.estimatedTime <= DAILY_TIME_LIMIT) {
            finalTasks.push(task);
            used += task.estimatedTime;
        }
    }

    if (finalTasks.length === 0) {
        return {
            status: "EMPTY",
            decisionReasons: ["All skills completed. No study required."]
        };
    }
    //skipped topics
    const skippedTopics = gaps
        .filter(gap => !finalTasks.some(t => t.topic === gap.topic))
        .map(gap => ({
            topic: gap.topic,
            category: gap.category,
            reason: `Skipped due to daily limit (priority ${gap.priority}, accuracy ${accuracyMap[gap.topic] ?? "N/A"}%)`
        }));

    // save plan
    const plan = await StudyPlan.create({
        userId,
        date: today,
        tasks: finalTasks,
        skippedTopics,
        decisionReasons
    });

    return {
        status: "CREATED",
        plan
    };
};
