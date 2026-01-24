const Skill = require("../models/skill");
const User = require("../models/User");
const roleSkillsMap = require("../utils/roleSkillsMap");
const MockTest = require("../models/MockTest");
const { getSkillsForRole } = require("../utils/roleSkillsMap");
exports.getSkillGap = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const skills = await Skill.find({ userId: req.user.id });

        const mocks = await MockTest.find({ userId: req.user.id });

        const mockAccuracy = {};
        mocks.forEach(m => {
            const acc = (m.correctAnswers / m.totalQuestions) * 100;
            if (!mockAccuracy[m.topic]) {
                mockAccuracy[m.topic] = { total: acc, count: 1 };
            } else {
                mockAccuracy[m.topic].total += acc;
                mockAccuracy[m.topic].count++;
            }
        });
        Object.keys(mockAccuracy).forEach(topic => {
            mockAccuracy[topic] = mockAccuracy[topic].total / mockAccuracy[topic].count;
        });

        const requiredSkills = getSkillsForRole(user.targetRole);
        if (!requiredSkills) {
            return res.status(400).json({ message: "Invalid targetRole" });
        }
        const userSkillMap = {};
        skills.forEach(skill => {
            userSkillMap[skill.topicName] = skill.status;
        });
        const gaps = [];
        for (let category in requiredSkills) {
            requiredSkills[category].forEach(topic => {
                const status = userSkillMap[topic] ?? 0;
                //priority logic
                let priority = 0;
                let reason = "";
                let source = mockAccuracy[topic] !== undefined ? "MOCK" : "SKILL";

                // else priority = 0;
                if (mockAccuracy[topic] !== undefined && mockAccuracy[topic] < 60) {
                    priority = 6;
                    reason = "Low mock accuracy";
                    source = "MOCK";
                }
                let confidenceScore = 0;

                if (mockAccuracy && mockAccuracy[topic] !== undefined) {
                    confidenceScore = Math.round(mockAccuracy[topic]);
                } else {
                    if (status === 0 && confidenceScore === 0) {
                        priority = 3;
                        reason = "Skill not started";
                    }
                    else if (status === 1 && confidenceScore < 50) {
                        priority = 3;
                        reason = "Learning but weal understanding";
                    }
                    else if (status === 1 && confidenceScore < 75) {
                        priority = 2;
                        reason = "Completed but low confidence";
                    } else {
                        priority = 0;
                    }
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
                            status === 0 ? "Start this topic from basics"
                                : status === 1
                                    ? "Revise & practice more problems"
                                    : "Review mock mistakes",

                    });
                }
            })
        }
        gaps.sort((a, b) => b.priority - a.priority);
        res.json(gaps);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};