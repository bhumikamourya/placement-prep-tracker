const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {getPerformanceAnalytics} = require("../controllers/performanceController");

router.get("/", auth, getPerformanceAnalytics);

module.exports = router;