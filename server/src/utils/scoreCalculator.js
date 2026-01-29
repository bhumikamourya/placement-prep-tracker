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
// utils/scoreCalculator.js
const calculateReadiness = async (skills = [], mocks = []) => {
    // skill score
    let skillScore = 0;
    if (skills.length > 0) {
        const total = skills.reduce((sum, s) => sum + (s?.status ?? 0), 0);
        skillScore = Math.round((total / (skills.length * 2)) * 100); // status max 2
    }

    // mock score
    let mockScore = 0;
    if (mocks.length > 0) {
        const totalAcc = mocks.reduce((sum, m) => {
            if (!m || m.totalQuestions === 0) return sum;
            return sum + ((m.correctAnswers ?? 0) / m.totalQuestions) * 100;
        }, 0);
        mockScore = Math.round(totalAcc / mocks.length);
    }

    // weighted readiness: 60% skills, 40% mocks
    const finalScore = Math.round(skillScore * 0.6 + mockScore * 0.4);
    return finalScore;
};

module.exports = { calculateSkillScore, calculateMockBonus, calculateReadiness };