const Skill = require("../models/skill.js");

//Add skill
exports.addSkill = async(req ,res)=>{
    try{
        const {category, topicName, status} = req.body;
        if(!category || ! topicName){
            return res.status(400).json({message: "Category, topic and status are required"});
        }

        const skill = await Skill.create({
            userId : req.user.id,
            category,
            topicName,
            status : Number(status)
        });
        res.status(201).json(skill);
    }catch(error){
        res.status(500).json({message:"Server Error"});
    }
};
//get user skills
exports.getSkills = async(req,res)=>{
    try{
        const skills = await Skill.find({userId: req.user.id});
        res.json(skills);
    }catch(error){
        res.status(500).json({message : "Server Error"});
    }
};

exports.updateSkill = async(req, res)=>{
    try{
        const {status, timeSpent} = req.body;

        const skill = await Skill.findOne({
            _id : req.params.id,
            userId: req.user.id,
        });
        if(!skill){
            return res.status(404).json({message: "Skill not found"});
        }
        if(status != undefined) skill.status = status;
        if(timeSpent != undefined) skill.timeSpent += timeSpent;

        skill.lastUpdated = new Date();
        await skill.save();
        res.json(skill);
    }catch(err){
        res.status(500).json({message : "Failed to update skill"});
    }
};