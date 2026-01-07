const Skill = require("../models/skill");
const MockTest = require("../models/MockTest.js");
const {calculateReadiness} = require("../utils/scoreCalculator.js");

exports.getReadinessScore = async(req, res)=>{
    try{ 
        const skills = await Skill.find({userId: req.user.id});
        const mocks = await MockTest.find({userId : req.user.id});

        const readinessScore = calculateReadiness(skills, mocks);
        res.json({
            readinessScore
        });
    }catch(error){
        res.status(500).json({message:"Server Error"});
    }
};
