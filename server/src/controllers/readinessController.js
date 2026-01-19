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

    let streak = 0;

  for (let i = history.length - 1; i > 0; i--) {
    const diff =
      (history[i].date - history[i - 1].date) / (1000 * 60 * 60 * 24);
    if (diff === 1) streak++;
    else break;
  }

  streak = history.length ? streak + 1 : 0;

  res.json({ history, streak });
};

exports.getReadinessExplanation = async(req, res)=>{
    res.json({
        explanation:[
            "DSA progress contributes 40%",
            "Mock test accuracy contributes 40%",
            "Consistency contributes 20%"
        ]
    })
}

