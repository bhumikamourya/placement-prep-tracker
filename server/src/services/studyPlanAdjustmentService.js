const PerformanceSnapshot = require("../models/PerformanceSnapshot");
const Skill = require("../models/skill");

exports.adjustStudyWeights = async(userId) =>{
    const lastPerformance = await PerformanceSnapshot.findOne({userId, date : {$lt : new Date()}}).sort({date : -1});
    if(!lastPerformance) return;
    let note = null;

    //poor execution -> reduce load
    if(lastPerformance.completionRate < 50){
        await Skill.updateMany(
            {userId, priority : "HIGH"},
            {$set :{priority : "MEDIUM"}}
        );
        console.log("Reducing workload");
        note = "Reduced workload due to low completion yesterday";
    }
    //good execution -> increase challenge
    if(lastPerformance.completionRate > 80){
        await Skill.updateMany(
            {userId, priority : "MEDIUM"},
            {$set : {priority :"HIGH"}}
        );
        console.log("Increasing challenge");
        note = "Increased difficulty based on strong execution";
    }
    return note;
};