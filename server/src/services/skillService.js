const Skill = require("../models/skill.js");

//Add skill
const addSkillService = async (userId, data)=>{
    const {category, topicName, status} = data;
        if(!category || ! topicName){
            throw new Error( "Category, topic and status are required");
        }

        return await Skill.create({
            userId,
            category,
            topicName,
            status : Number(status)
        });
}
//getSkills
const getSkillsService = async(userId)=>{
    return await Skill.find({userId});
}

//updateSkills
const updateSkillService = async(userId, skillId, data)=>{
    const {status, timeSpent} = data;

    const skill = await Skill.findOne({
        _id: skillId,
        userId
    });  

    if(!skill) {
        throw new Error("Skill not found");
    }

    if(status !== undefined) skill.status = status;
    if(timeSpent !== undefined) skill.timeSpent += Number(timeSpent);

    skill.lastUpdated = new Date();
    return await skill.save();
};

module.exports = {
    addSkillService, getSkillsService, updateSkillService
};