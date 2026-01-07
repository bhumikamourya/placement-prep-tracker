const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { getSkillGap } = require("../controllers/skillGapController");
router.get("/", auth, getSkillGap);
module.exports = router;