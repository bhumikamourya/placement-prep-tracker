const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {getPerformanceAnalytics} = require("../controllers/performanceSnapshot");

router.get("/performance", auth, getPerformanceAnalytics);

module.exports = router;