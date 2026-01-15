const express = require("express");
const router = express.Router() ;
const auth = require("../middleware/authMiddleware");
const {getReadinessScore, getReadinessTrend} = require("../controllers/readinessController");


router.get("/", auth, getReadinessScore);
router.get("/trend", auth, getReadinessTrend );

module.exports = router;