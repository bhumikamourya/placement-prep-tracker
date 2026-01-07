const express = require("express");
const router = express.Router() ;
const auth = require("../middleware/authMiddleware");
const {getReadinessScore} = require("../controllers/readinessController");


router.get("/", auth, getReadinessScore);

module.exports = router;