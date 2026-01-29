const {getPerformanceAnalyticsService, getWeeklyPerformanceService} = require("../services/performanceService");


exports.getPerformanceAnalytics = async (req, res) => {
    try {
        const data = await getPerformanceAnalyticsService(req.user.id);
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message });
    }
};

exports.getWeeklyPerformance = async (req, res) => {
    try {
        const data = await getWeeklyPerformanceService(req.user.id);
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch weekly performance" });
    }
};