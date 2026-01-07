const express = require("express");
const router = express.Router() ;
const auth = require("../middleware/authMiddleware");
const {generateStudyPlan, getTodayPlan , markTaskDone} = require("../controllers/studyPlanController.js");

router.post("/generate", auth, generateStudyPlan);
router.get("/today" ,auth, getTodayPlan);
router.patch("/task/:taskId" , auth , markTaskDone);

module.exports = router;