const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes.js");
const skillRoutes = require("./routes/skillRoutes.js");
const mockRoutes = require("./routes/mockRoutes.js");
const readinessRoutes = require("./routes/readinessRoutes.js");
const skillGapRoutes = require("./routes/skillGapRoutes.js");
const studyPlanRouter = require("./routes/studyPlanRoutes.js");
const dashboardRoutes = require("./routes/dashboardRoutes.js");
const performanceRoutes = require("./routes/performanceRoutes.js");

const app = express();

app.use(cors());
app.use(express.json());

//Routes
app.use("/api/auth", authRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/mocks", mockRoutes);
app.use("/api/readiness", readinessRoutes);
app.use("/api/skill-gap" , skillGapRoutes);
app.use("/api/study-plan", studyPlanRouter);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/performance", performanceRoutes);

module.exports = app; //export app for server.js