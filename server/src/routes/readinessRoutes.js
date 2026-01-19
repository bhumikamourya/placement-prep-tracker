const express = require("express");
const router = express.Router() ;
const auth = require("../middleware/authMiddleware");
const {getReadinessScore, getReadinessTrend, getReadinessExplanation} = require("../controllers/readinessController");


router.get("/", auth, getReadinessScore);
router.get("/trend", auth, getReadinessTrend );
router.get("/explain" , auth, getReadinessExplanation)

module.exports = router;