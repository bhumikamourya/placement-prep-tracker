const StudyPlan = require("../models/StudyPlan");
const Skill = require("../models/skill");
const MockTest = require("../models/MockTest");
const {saveDailyPerformance} = require("../services/performanceService");

const DAILY_TIME_LIMIT = 120;

const getToday = () => new Date().toISOString().split("T")[0];

exports.generateStudyPlan = async (req ,res)=>{
    try { 
        const userId = req.user.id;
        const today = getToday();

        //prevent duplicate plan
        const existing = await StudyPlan.findOne({userId, date : today});
        if(existing) return res.json(existing);

        //fetch data
        const skills = await Skill.find({userId});
        const mocks= await MockTest.find({userId});

        //build mock accuracy map
        const accuracyMap = {};
        mocks.forEach(m =>{
            accuracyMap[m.topic] = (m.correctAnswers/m.totalQuestions)*100;
        });

        let tasks= [];
         //missing topics ->high
         skills.filter(s=>s.status === 0).forEach(skill =>{
            tasks.push({
                topic : skill.topicName,
                category : skill.category,
                estimatedTime : 60,
                priority : "HIGH"
            });
         });

         //weak topics ->medium
         skills.filter(s=>s.status === 1).forEach(skill =>{
            let time = 30;
            if(accuracyMap[skill.topicName] < 50) time +=20;
            tasks.push({
                topic : skill.topicName,
                category : skill.category,
                estimatedTime : time,
                priority : "MEDIUM"
            });
         });

         //time balancing
         let used = 0;
         const finalTasks =[];
         for(let task of tasks){
            if(used + task.estimatedTime <= DAILY_TIME_LIMIT){
                finalTasks.push(task);
                used += task.estimatedTime;
            }
         }

         //save plan
         const plan = await StudyPlan.create({
            userId,
            date : today,
            tasks : finalTasks
         });

         res.status(201).json(plan);
    }catch(error){
        if(error.code === 11000){
            const plan = await StudyPlan.findOne({
                userId : req.user.id,
                date : getToday()
            })
            return res.json(plan);
        }
        res.status(500).json({message : "Failed to generate study plan"})
    }
};

exports.getTodayPlan = async (req , res)=>{
    const plan = await StudyPlan.findOne({
        userId : req.user.id,
        date : getToday()
    });
    if(!plan){
        return res.status(404).json({message : "No plan for today"});
    }
    res.json(plan);
};

exports.markTaskDone = async (req, res)=>{
    const plan = await StudyPlan.findOne({"tasks._id":req.params.taskId});
    if(!plan) return res.status(404).json({message : "Task not found"});

    plan.tasks.id(req.params.taskId).status = "DONE";
    await plan.save();

    await saveDailyPerformance(plan.userId);

    res.json({message : "Task marked DONE "});
};