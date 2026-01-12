const Skill = require("../models/skill.js");

//Add skill
exports.addSkill = async(req ,res)=>{
    try{
        const {category, topicName, status} = req.body;
        if(!category || ! topicName){
            return res.status(401).json({message: "Category and topic are required"});
        }

        const skill = await Skill.create({
            userId : req.user.id,
            category,
            topicName,
            status
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