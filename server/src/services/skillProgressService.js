const Skill = require("../models/skill");

exports.updateSkillAfterStudy = async({userId, topic, minutes})=>{
    const skill =await Skill.findOne({userId, topicName : topic});

    if(!skill) return;

    //update time
    skill.timeSpent += minutes;
    skill.lastUpdated = new Date();

    //status upgrade logic
    if(skill.status === 0){
        skill.status = 1; // started
    }else if(skill.status === 1 && skill.timeSpent >= 300){
        skill.status =2; //strong after 5 hrs
    }

    await skill.save();
};