const { addMockTestService, getMockTestService, getWeakTopicsService, getMockAnalysisService} = require("../services/mockService");

//add mock test
exports.addMockTest = async (req, res) => {
    try {
        const mock = await addMockTestService(req.user.id, req.body);
        res.status(201).json(mock);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

//get user mock tests
exports.getMockTests = async (req, res) => {
    try {
        const tests = await getMockTestService(req.user.id);
        res.json(tests);
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
};

//get weak topics
exports.getWeakTopics = async (req, res) => {
    try {
        const weak = await getWeakTopicsService(req.user.id);
        res.json(weak);
    } catch (err) {
        res.status(500).json({ message: err.message});
    }
};
//get->mockAnalysis
exports.getMockAnalysis = async (req, res) => {
    try {
        const analysis = await getMockAnalysisService(req.user.id);
        res.json(analysis);
    } catch (err) {
        res.status(500).json({ message:err.message });
    }
};
