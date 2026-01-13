const skillScoreMap = {
    0: 0, // not started
    1: 2,//in progress
    2: 5  //strong
};
//calculate skill score
const calculateSkillScore = (skills) => {
    let score = 0;
    skills.forEach(skill => {
        score += skillScoreMap[skill.status] || 0;
    });
    return score;
};
//calculate mocktest bonus
const calculateMockBonus = (mockTests) => {
    let bonus = 0;
    mockTests.forEach(test => {
        const accuracy = (test.correctAnswers / test.totalQuestions) * 100;
        if (accuracy >= 70) bonus += 2;
    });
    return bonus;
};

//final readiness score
const calculateReadiness = (skills, mockTests) => {
    const skillScore = calculateSkillScore(skills);
    const mockBonus = calculateMockBonus(mockTests);
    return skillScore + mockBonus;
};
module.exports = { calculateSkillScore, calculateMockBonus, calculateReadiness };