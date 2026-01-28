const ReadinessHistory = require("../models/ReadinessHistory.js");
const Skill = require("../models/skill.js");
const MockTest = require("../models/MockTest.js");
const { saveReadinessSnapshot } = require("../services/readinessService.js");
const { calculateReadiness } = require("../utils/scoreCalculator.js");

exports.calculateReadiness = async (req, res) => {
    try {
        const skills = await Skill.find({ userId: req.user.id });
        const mocks = await MockTest.find({ userId: req.user.id });
        const score = await calculateReadiness(skills, mocks);
        await saveReadinessSnapshot(req.user.id, score);
        res.json({ readinessScore: score });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

exports.getLatestReadiness = async (req, res) => {
    try {
        const latest = await ReadinessHistory.findOne({ userId: req.user.id }).sort({ date: -1 });

        res.json({ readinessScore: latest?.score || 0 });
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
};

exports.getReadinessTrend = async (req, res) => {
    try {
        const history = await ReadinessHistory
            .find({ userId: req.user.id })
            .sort({ date: 1 });

        if (history.length === 0) {
            return res.json({ data: [], streak: 0 });
        }

        const data = history.map(item =>({
            date: item.date.toISOString().split("T")[0],
            score: item.score
        }));

        let streak = 1;

        for (let i = history.length - 1; i > 0; i--) {
            const curr = new Date(history[i].date);
            const prev = new Date(history[i - 1].date);

            curr.setHours(0, 0, 0, 0);
            prev.setHours(0, 0, 0, 0);

            const diffDays = (curr - prev) / (1000 * 60 * 60 * 24);

            if (diffDays === 1) streak++;
            else {
                break;
            }
        }

        res.json({ data, streak });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

exports.getReadinessExplanation = async (req, res) => {
    try {
        res.json({
            explanation: [
               {
                factor: "DSA Progress",
                weight: 40,
                description: "Based on completed v/s pending DSA topics"
               },
               {
                factor: "Mock Accuracy",
                weight: 40,
                description: "Accuracy and consistency in mock tests"
               },
               {
               factor: "Consistency",
               weight: 20,
               description: "Daily activity and streak maintenance"
               }
            ]
        })
    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message });
    }
}

