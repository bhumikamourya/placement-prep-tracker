const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {getPerformanceAnalytics, getWeeklyPerformance} = require("../controllers/performanceController");

router.get("/", auth, getPerformanceAnalytics);
router.get("/weekly", auth, getWeeklyPerformance);

module.exports = router;