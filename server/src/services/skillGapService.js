const Skill = require("../models/skill.js");
const User = require("../models/User");
// const roleSkillsMap = require("../utils/roleSkillsMap");
const MockTest = require("../models/MockTest");
const { getSkillsForRole } = require("../utils/roleSkillsMap");

exports.getTopSkillGaps = async (userId, limit = 5) => {
    try {
        const user = await User.findById(userId);
        if(!user) return [];

        const skills = await Skill.find({ userId});
        const mocks = await MockTest.find({ userId});

        const mockAccuracy = {};
        mocks.forEach(m => {
            const acc = (m.correctAnswers / m.totalQuestions) * 100;
            mockAccuracy[m.topic] = acc;
        });

        const requiredSkills = getSkillsForRole(user.targetRole);
        const gaps = [];

        for (let category in requiredSkills) {
            for(let topic of requiredSkills[category]){
                const skillObject = skills.find(s => s.topicName === topic);
                const status = skillObject ? skillObject.status : 0;
                const accuracy = mockAccuracy[topic];
                //priority logic
                let priority = 0;

               if(accuracy !== undefined && accuracy < 60) priority = 6;
               else if(status === 0) priority = 3;
               else if(status === 1) priority = 2;
                if (priority > 0) {
                    gaps.push({
                        topic,
                        category,
                        priority,
                        status
                    });
                }
            }
        }
        gaps.sort((a, b) => b.priority - a.priority);
        return gaps.slice(0, limit);
    } catch (error) {
        console.error("Skill gap service error : ", error);
        return [];
    }
};