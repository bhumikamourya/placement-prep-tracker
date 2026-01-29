const {addSkillService, getSkillsService, updateSkillService} = require("../services/skillService");

//Add skill
exports.addSkill = async(req ,res)=>{
    try{
        const skill =  await addSkillService(req.user.id, req.body);
        res.status(201).json(skill);
    }catch(err){
        res.status(500).json({message:err.message});
    }
};
//get user skills
exports.getSkills = async(req,res)=>{
    try{
        const skills = await getSkillsService( req.user.id );
        res.json(skills);
    }catch(err){
        res.status(500).json({message : "Server Error"});
    }
};
//update skill
exports.updateSkill = async(req, res)=>{
    try{
        const skill = await updateSkillService(
            req.user.id,
            req.params.id,
            req.body
        );
        res.json(skill);
    }catch(err){
        res.status(500).json({message : err.message});
    }
};