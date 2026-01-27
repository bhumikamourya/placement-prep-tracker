const Skill = require("../models/skill");
const MockTest = require("../models/MockTest");
const PerformanceSnapshot = require("../models/PerformanceSnapshot");

exports.evaluateSkillStrength = async(userId) =>{
    const recentPerformance = await PerformanceSnapshot.find({userId}).sort({date : -1}).limit(5);

    if(recentPerformance.length < 3) return ;

    const avgCompletion = Math.round(
        recentPerformance.reduce((a, b) => a+ b.completionRate, 0) / recentPerformance.length
    );
    //if user is aalsi, stop
    if(avgCompletion < 70) return ;

    //mocks check
    const  mocks = await MockTest.find({userId});

    const accuracyMap = {};
    mocks.forEach(m =>{
        if(m.totalQuestions > 0 ){
            accuracyMap[m.topic] = (m.correctAnswers / m.totalQuestions) *100;
        }
    });

    //upgrade skills
    const skills = await Skill.find({userId, status : 1});

    for(let skill of skills) {
        const acc = accuracyMap[skill.topicName];

        if(acc !== undefined && acc >= 75 && skill.timeSpent >= 300){
            skill.status = 2; //strong
            skill.lastUpdated = new Date();
            await skill.save();
        }
    }


}