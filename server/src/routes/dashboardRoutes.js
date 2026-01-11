const express = require("express");
const router = express.Router();
const {getDashboardData } = require("../controllers/dashboardController");
const auth = require("../middleware/authMiddleware");

router.get("/", auth, getDashboardData);

module.exports = router;