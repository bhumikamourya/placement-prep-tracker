const StudyPlan = require("../models/StudyPlan");
const { saveDailyPerformance } = require("../services/performanceService");
const { updateSkillAfterStudy } = require("../services/skillProgressService");
const { getStartOfToday } = require("../utils/date");
const { generateDailyStudyPlan } = require("../services/studyPlanService");

exports.generateStudyPlan = async (req, res) => {
    try {
        const result = await generateDailyStudyPlan(req.user.id);

        if (result.status === "EXISTS") {
            return res.status(200).json(result.plan);
        }

        if (result.status === "EMPTY") {
            return res.status(200).json({
                message: "No study plan required today", 
                reasons: result.decisionReasons
            });
        }

        res.status(201).json(result.plan);
    } catch (err) {
        //  console.error("STUDY PLAN GENERATION FAILED:", err);
        res.status(500).json({ message: "Failed to generate study plan", error: err.message });
    }
};

exports.getTodayPlan = async (req, res) => {
    try {

        const today = getStartOfToday();
        const plan = await StudyPlan.findOne({
            userId: req.user.id,
            date: today
        });
        if (!plan) {
            return res.status(404).json({ message: "No plan for today" });
        }
        res.json(plan);
    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message });
    }
};

exports.markTaskDone = async (req, res) => {
    try {
        const plan = await StudyPlan.findOne({ userId: req.user.id, "tasks._id": req.params.taskId });
        if (!plan) {
            return res.status(404).json({ message: " Task not found" });
        }
        const task = plan.tasks.id(req.params.taskId);

        if (!task) return res.status(404).json({ message: "Task not found" });

        if (task.status === "DONE") {
            return res.status(400).json({ message: "Task already completed" });
        }
        task.status = "DONE";
        await plan.save();

        await updateSkillAfterStudy({
            userId: plan.userId,
            topic: task.topic,
            minutes: task.estimatedTime
        });
        await saveDailyPerformance(plan.userId);

        res.json({ message: "Task marked DONE " });
    } catch (err) {
        console.error("MARK TASK ERROR:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};