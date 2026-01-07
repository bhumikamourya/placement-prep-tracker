const express = require("express");
const router = express.Router() ;
const auth = require("../middleware/authMiddleware");
const {addSkill , getSkills} = require("../controllers/skillController");


router.post("/",auth, addSkill);
router.get("/",auth, getSkills);

module.exports = router;