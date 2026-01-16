const express = require("express");
const router = express.Router() ;
const auth = require("../middleware/authMiddleware");
const {generateStudyPlan, getTodayPlan , markTaskDone} = require("../controllers/studyPlanController.js");

router.get("/" ,auth, getTodayPlan);
router.post("/generate", auth, generateStudyPlan);
router.patch("/task/:taskId/complete" , auth , markTaskDone);

module.exports = router;