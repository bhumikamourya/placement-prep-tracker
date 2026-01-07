const MockTest = require("../models/MockTest");

//add mock test
exports.addMockTest = async (req, res) => {
    try {
        const { topic, totalQuestions, correctAnswers } = req.body;

        if (!topic || !totalQuestions || correctAnswers === undefined) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (correctAnswers > totalQuestions) {
            return res.status(400).json({ message: "Invalid answers count" });
        }

        const mockTest = await MockTest.create({
            userId: req.user.id,
            topic,
            totalQuestions,
            correctAnswers
        });
        res.status(201).json(mockTest);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

//get user mock tests
exports.getMockTests = async (req, res) => {
    try {
        const tests = await MockTest.find({ userId: req.user.id });
        res.json(tests);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

//get weak topics
exports.getWeakTopics = async (req, res) => {
    try {
        const tests = await MockTest.find({ userId: req.user.id });
        const topicAccuracy = {};
        tests.forEach(test => {
            const accuracy = (test.correctAnswers / test.totalQuestions) * 100;
            if (!topicAccuracy[test.topic]) {
                topicAccuracy[test.topic] = [];
            }
            topicAccuracy[test.topic].push(accuracy);
        });
        const weakTopics = [];
        for (let topic in topicAccuracy) {
            const avg = topicAccuracy[topic].reduce((a, b) => a + b, 0) / topicAccuracy[topic].length;
            if(avg < 70){
                weakTopics.push({
                    topic,averageAccuracy: avg.toFixed(2)
                });
            }
        }
        res.json(weakTopics);
    }catch(error){
        res.status(500).json({message: "Server Error"});
    }
};