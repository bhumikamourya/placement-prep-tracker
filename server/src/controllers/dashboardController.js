const Skill = require("../models/skill");
const StudyPlan = require("../models/StudyPlan");
const User = require("../models/User");

exports.getDashboardData = async (req ,res) =>{
    try{
        const userId = req.user.id;

        //user
        const user = await User.findById(userId);

        //skills
        const skills = await Skill.find({userId});
        const totalSkills = skills.length;
        const weakSkills = skills.filter(s => s.status < 2).length;

        //studyPlan
        const plans = await StudyPlan.find({userId});
        let totalTasks = 0;
        let completedTasks = 0;

        plans.forEach(plan =>{
            totalTasks += plan.tasks.length;
            completedTasks += plan.tasks.filter(t => t.status === "DONE").length;
        });
        const pendingTasks = totalTasks - completedTasks;

        res.json({
            userName: user.name,
            totalSkills,
            weakSkills,
            totalTasks,
            completedTasks,
            pendingTasks
        });
    }catch(error) {
        res.status(500).json({message:"Failed to load dashboard data"});
    }
};