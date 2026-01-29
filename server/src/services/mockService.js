const MockTest = require("../models/MockTest");

//addMockTest
const addMockTestService = async (userId, data )=> {
    const {topic, totalQuestions, correctAnswers} = data;

    if (!topic || totalQuestions == null || correctAnswers == null) {
        throw new Error("All fields are required");
    }

    if (correctAnswers > totalQuestions) {
        throw new Error("Invalid answers count");
    }

    return await MockTest.create({
        userId,
        topic,
        totalQuestions,
        correctAnswers
    });
};

//getmocktest
const getMockTestService = async (userId) =>{
    return await MockTest.find({userId}).sort({date: -1});
};

//getWeakTopics
const getWeakTopicsService = async(userId) =>{
    const tests = await MockTest.find({userId});

    const topicAccuracy = {};

    tests.forEach(t =>{
        const acc = (t.correctAnswers / t.totalQuestions) * 100;
        topicAccuracy[t.topic] = topicAccuracy[t.topic] || [];
        topicAccuracy[t.topic].push(acc);
    })

    return Object.entries(topicAccuracy)
        .map(([topic, arr]) => ({
            topic,
            averageAccuracy: (
                arr.reduce((a, b) => a + b, 0) / arr.length
            ).toFixed(2)
        }))
        .filter(t => t.averageAccuracy < 70);
}

//analyze
const getMockAnalysisService = async (userId) => {
    const tests = await MockTest.find({ userId });

    if (!tests.length) return { hasMock: false };

    let totalQ = 0, totalCorrect = 0;
    const topicAccuracy = {};

    tests.forEach(t => {
        totalQ += t.totalQuestions;
        totalCorrect += t.correctAnswers;

        const acc = (t.correctAnswers / t.totalQuestions) * 100;
        topicAccuracy[t.topic] = topicAccuracy[t.topic] || [];
        topicAccuracy[t.topic].push(acc);
    });

    const accuracy = Math.round((totalCorrect / totalQ) * 100);

    const weakTopics = Object.entries(topicAccuracy)
        .map(([topic, arr]) => ({
            topic,
            avg: arr.reduce((a, b) => a + b, 0) / arr.length
        }))
        .filter(t => t.avg < 70)
        .map(t => t.topic);

    const readinessImpact = accuracy >= 80 ? 5 : accuracy >= 60 ? 0 : -5;

    return {
        hasMock: true,
        accuracy,
        totalQuestions: totalQ,
        correctAnswers: totalCorrect,
        weakTopics,
        readinessImpact
    };
};

module.exports = {
    addMockTestService,
    getMockTestService,
    getWeakTopicsService,
    getMockAnalysisService
};