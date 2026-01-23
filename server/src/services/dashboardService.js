const Skill = require("../models/skill");
const StudyPlan = require("../models/StudyPlan");
const MockTest = require("../models/MockTest");
const ReadinessHistory = require("../models/ReadinessHistory");
const roleSkillsMap = require("../utils/roleSkillsMap");
const { calculateReadiness } = require("../utils/scoreCalculator");

exports.getDashboardOverview = async (userId) => {
    const skills = await Skill.find({ userId });
    const plans = await StudyPlan.find({ userId });
    const mocks = await MockTest.find({ userId });
    
    const totalSkills = skills.length;
    const weakSkills = skills.filter(s => s.status < 2).length;

    let totalTasks = 0;
    let completedTasks = 0;

    plans.forEach(plan => {
        totalTasks += plan.tasks.length;
        completedTasks += plan.tasks.filter(t => t.status === "DONE").length;
    });
    const pendingTasks = totalTasks - completedTasks;

    const readinessScore = calculateReadiness(skills, mocks);

    const latestReadiness = await ReadinessHistory.findOne({ userId }).sort({ date: -1 });
    const lastScore  = latestReadiness?.score ?? readinessScore;

    const delta = readinessScore - lastScore;

    let focusMessage = "";
    if(weakSkills > totalSkills *0.6){
        focusMessage = "High skill gaps detected. Focus on completing fundamentals before attempting more mocks.";
    }
    else if(completedTasks/totalTasks < 0.5){
        focusMessage = "Low task completion. Improve daily consistency to boost readiness.";
    }
    else if(delta < 0){
        focusMessage = "Readiness dropped since last check. Review weak mock topics and revise core concepts.";
    }
    else if(delta > 0){
        focusMessage = "Good progress! Readiness improving. Maintain momentum.";
    }else {
        focusMessage = "Stable performance. Push mocks and advanced problems."
    }

    return {
        user: {
        totalSkills,
        weakSkills
        },
        study:{
        totalTasks,
        completedTasks,
        pendingTasks
        },
        readiness :{
            current : readinessScore,
            last : lastScore,
            delta 
        },
        mocks : {
            totalMocks : mocks.length
        },
        focusMessage : focusMessage
    };
};