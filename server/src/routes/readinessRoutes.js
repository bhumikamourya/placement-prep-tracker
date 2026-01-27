const express = require("express");
const router = express.Router() ;
const auth = require("../middleware/authMiddleware");
const {getLatestReadiness, getReadinessTrend, getReadinessExplanation, calculateReadiness} = require("../controllers/readinessController");

router.post("/calculate", auth, calculateReadiness);
router.get("/latest", auth, getLatestReadiness);
router.get("/trend", auth, getReadinessTrend );
router.get("/explain" , auth, getReadinessExplanation)

module.exports = router;