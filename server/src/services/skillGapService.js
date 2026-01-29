const Skill = require("../models/skill");
const User = require("../models/User");
const MockTest = require("../models/MockTest");
const { getSkillsForRole } = require("../utils/roleSkillsMap");

//calculateMock test accuracy
const calculateMockAccuracy = (mocks) => {
    const map = {};

    mocks.forEach(m => {
        const acc = (m.correctAnswers / m.totalQuestions) * 100;
        if (!map[m.topic]) map[m.topic] = [];
        map[m.topic].push(acc);
    });

    Object.keys(map).forEach(topic => {
        const arr = map[topic];
        map[topic] = Math.round(arr.reduce((a, b) => a + b, 0) / arr.length);
    });

    return map;
};

// get skills gaps
const getSkillGapsService = async (userId) => {
    const user = await User.findById(userId);
    if (!user) throw new Error("USER_NOT_FOUND");

    const skills = await Skill.find({ userId });
    const mocks = await MockTest.find({ userId });

    const requiredSkills = getSkillsForRole(user.targetRole);
    if (!requiredSkills) throw new Error("INVALID_ROLE");

    const mockAccuracy = calculateMockAccuracy(mocks);

    const skillMap = {};
    skills.forEach(s => {
        skillMap[s.topicName] = s.status;
    });

    const gaps = [];

    for (const category in requiredSkills) {
        for (const topic of requiredSkills[category]) {
            const status = skillMap[topic] ?? 0;
            const accuracy = mockAccuracy[topic];

            let priority = 0;
            let reason = "";
            let source = "SKILL";
            let confidenceScore = accuracy ?? 0;

            if (accuracy !== undefined && accuracy < 60) {
                priority = 6;
                reason = "Low mock accuracy";
                source = "MOCK";
            } else if (status === 0) {
                priority = 3;
                reason = "Skill not started";
            } else if (status === 1) {
                priority = 2;
                reason = "Learning but needs practice";
            }

            if (priority > 0) {
                gaps.push({
                    category,
                    topic,
                    status,
                    priority,
                    reason,
                    source,
                    confidenceScore,
                    recommendation:
                        status === 0
                            ? "Start this topic from basics"
                            : status === 1
                                ? "Revise and practice problems"
                                : "Analyze mock mistakes"
                });
            }
        }
    }

    return gaps.sort((a, b) => b.priority - a.priority);
};

//get top (highest) skill gap
const getTopSkillGapsService = async (userId, limit = 5) => {
    const gaps = await getSkillGapsService(userId);
    return gaps.slice(0, limit);
};

module.exports = {
    getSkillGapsService,
    getTopSkillGapsService
};
