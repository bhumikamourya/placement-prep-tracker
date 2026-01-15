const Skill = require("../models/skill");
const MockTest = require("../models/MockTest.js");
const ReadinessHistory = require("../models/ReadinessHistory.js");
const { calculateReadiness } = require("../utils/scoreCalculator.js");
const { saveReadinessSnapshot } = require("../services/readinessService.js");

exports.getReadinessScore = async (req, res) => {
    try {
        const skills = await Skill.find({ userId: req.user.id });
        const mocks = await MockTest.find({ userId: req.user.id });

        const readinessScore = calculateReadiness(skills, mocks);

         await saveReadinessSnapshot(req.user.id, readinessScore);
        res.json({
            readinessScore
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

exports.getReadinessTrend = async (req, res) => {
    const history = await ReadinessHistory
        .find({ userId: req.user.id })
        .sort({ date: 1 });

    const streak = history.reduce((count, item, index) => {
        if (index === 0) return 1;
        const diff =
            (item.date - history[index - 1].date) / (1000 * 60 * 60 * 24);
        return diff === 1 ? count + 1 : count;
    }, 0);

    res.json({ history, streak });
};

