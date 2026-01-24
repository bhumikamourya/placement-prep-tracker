const StudyPlan = require("../models/StudyPlan");
const Skill = require("../models/skill");
const MockTest = require("../models/MockTest");
const { saveDailyPerformance } = require("../services/performanceService");
const { adjustStudyWeights } = require("../services/studyPlanAdjustmentService");

const DAILY_TIME_LIMIT = 120;

const getToday = () => new Date().toISOString().split("T")[0];

exports.generateStudyPlan = async (req, res) => {
    try {
        const userId = req.user.id;
        const today = getToday();

        //prevent duplicate plan
        const existing = await StudyPlan.findOne({ userId, date: today });
        if (existing) return res.json(existing);

        //fetch data
        const skills = await Skill.find({ userId });

        //block meaningless system outputs.
        if (skills.length === 0) {
            return res.status(400).json({
                message: "No skills found. Add skills before generating study plan."
            })
        }

        let reasons = [];

        skills.filter(s => s.status === 0).forEach(skill => {
            reasons.push(`Added ${skill.topicName} because it is not started `);
        });

        skills.filter(s => s.status === 1).forEach(skill => {
            reasons.push(`Continued ${skill.topicName} due to partial mastery`);
        })

        const adjustmentNote = await adjustStudyWeights(userId);


        const mocks = await MockTest.find({ userId });

        //build mock accuracy map
        const accuracyMap = {};
        mocks.forEach(m => {
            if (m.totalQuestions > 0) {
                accuracyMap[m.topic] = (m.correctAnswers / m.totalQuestions) * 100;
            }
        });

        let tasks = [];
        //missing topics ->high
        skills.filter(s => s.status === 0).forEach(skill => {
            tasks.push({
                topic: skill.topicName,
                category: skill.category,
                estimatedTime: 60,
                priority: "HIGH",
                status: "PENDING"
            });
        });

        //weak topics ->medium
        skills.filter(s => s.status === 1).forEach(skill => {
            let time = 30;
            if (accuracyMap[skill.topicName] < 50) time += 20;
            tasks.push({
                topic: skill.topicName,
                category: skill.category,
                estimatedTime: time,
                priority: "MEDIUM",
                status: "PENDING"
            });
        });

        //time balancing
        let used = 0;
        const finalTasks = [];
        for (let task of tasks) {
            if (used + task.estimatedTime <= DAILY_TIME_LIMIT) {
                finalTasks.push(task);
                used += task.estimatedTime;
            }
        }

        if (finalTasks.length === 0) {
            return res.json({
                userId,
                date: today,
                tasks: [],
                decisionReasons: [
                    "All skills completed. No study plan required today."
                ],
                adjustmentNote: null
            });
        }

        //save plan
        const plan = await StudyPlan.create({
            userId,
            date: today,
            tasks: finalTasks,
            adjustmentNote,
            decisionReasons: reasons
        });

        res.status(201).json(plan);

    } catch (error) {
        if (error.code === 11000) {
            const plan = await StudyPlan.findOne({
                userId: req.user.id,
                date: getToday()
            })
            return res.json(plan);
        }
        res.status(500).json({ message: "Failed to generate study plan" ,error : err.message})
    }
};

exports.getTodayPlan = async (req, res) => {
    try{
    const plan = await StudyPlan.findOne({
        userId: req.user.id,
        date: getToday()
    });
    if (!plan) {
        return res.status(404).json({ message: "No plan for today" });
    }
    res.json(plan);
}catch(err){
    res.status(500).json({message : "Server Error", error : err.message});
}
};

exports.markTaskDone = async (req, res) => {
    try{
    const plan = await StudyPlan.findOne({ userId: req.user.id, "tasks._id": req.params.taskId });
    const task = plan.tasks.id(req.params.taskId);

    if (!task) return res.status(404).json({ message: "Task not found" });

    if (task.status === "DONE") {
        return res.status(400).json({ message: "Task already completed" });
    }
    task.status = "DONE";
    await plan.save();

    await saveDailyPerformance(plan.userId);

    res.json({ message: "Task marked DONE " });
}catch(err){
    res.status(500).json({message : "Server error", error : err.message});
}
};