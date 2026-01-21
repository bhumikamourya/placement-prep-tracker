const Skill = require("../models/skill");
const User = require("../models/User");
const roleSkillsMap = require("../utils/roleSkillsMap");
const MockTest = require("../models/MockTest");
exports.getSkillGap = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const skills = await Skill.find({ userId: req.user.id });

        const mocks = await MockTest.find({ userId: req.user.id });

        const mockAccuracy = {};
        mocks.forEach(m => {
            mockAccuracy[m.topic] =
                (m.correctAnswers / m.totalQuestions) * 100;
        });

        const requiredSkills = roleSkillsMap[user.targetRole];
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
                let source  =" SKILL";
                if (status === 0) {
                    priority = 5;
                    reason = "Not started";
                }
                else if (status === 1) {
                    priority = 3;
                    reason = "In progress";
                }
                // else priority = 0;
                if(mockAccuracy[topic] !== undefined && mockAccuracy[topic] < 60){
                    priority = 6;
                    reason = "Low mock accuracy";
                    source = "MOCK";
                }
                if (priority > 0) {
                    gaps.push({ category, topic, status, priority, reason,source });
                }
            })
        }
        gaps.sort((a, b) => b.priority - a.priority);
        res.json(gaps);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};