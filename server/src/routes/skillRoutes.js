const express = require("express");
const router = express.Router() ;
const auth = require("../middleware/authMiddleware");
const {addSkill , getSkills, updateSkill} = require("../controllers/skillController");


router.post("/",auth, addSkill);
router.get("/",auth, getSkills);
router.put("/:id" , auth, updateSkill);

module.exports = router;