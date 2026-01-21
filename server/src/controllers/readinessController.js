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
    try{
    const history = await ReadinessHistory
        .find({ userId: req.user.id })
        .sort({ date: 1 });

        if(history.length === 0){
            return res.json({history :[], streak :0});
        }

    let streak = 1;

  for (let i = history.length - 1; i > 0; i--) {
    const curr = new Date(history[i].date);
    const prev = new Date(history[i - 1].date);

    curr.setHours(0,0,0,0);
    prev.setHours(0,0,0,0);

    const diffDays = (curr - prev) / (1000 *60 *60*24);

    if (diffDays === 1) streak++;
    else {
        break;
    }
  }

  res.json({ history, streak });
}catch(error){
    res.status(500).json({message : "Server Error"});
}
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

