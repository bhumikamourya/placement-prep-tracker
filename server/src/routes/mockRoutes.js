const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {addMockTest, getMockTests, getWeakTopics, getMockAnalysis} = require("../controllers/mockController");

router.post("/", auth, addMockTest);
router.get("/" ,auth, getMockTests);
router.get("/weak", auth, getWeakTopics);
router.get("/analysis", auth, getMockAnalysis);

module.exports = router;