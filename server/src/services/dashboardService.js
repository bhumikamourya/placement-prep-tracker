const Skill = require("../models/skill");
const StudyPlan = require("../models/StudyPlan");
const MockTest = require("../models/MockTest");
const ReadinessHistory = require("../models/ReadinessHistory");
const PerformanceSnapshot = require("../models/PerformanceSnapshot");
const User = require("../models/User");
const {getStartOfToday} = require("../utils/date");

exports.getDashboardOverview = async (userId) => {

  const today = getStartOfToday();

  // BASIC USER INFO
  const user = await User.findById(userId).select("name");

  //CORE DATA
  const skills = await Skill.find({ userId });

  const todayPlan = await StudyPlan.findOne({
    userId,
    date: today
  })

  const mocks = await MockTest.find({ userId });

  //SKILL METRICS
  const totalSkills = skills.length;
  const weakSkills = skills.filter(s => s.status < 2).length;

  // STUDY TASK METRICS
  let totalTasks = 0;
  let completedTasks = 0;

  if(todayPlan) {
    totalTasks = todayPlan.tasks.length;
    completedTasks = todayPlan.tasks.filter(
      t => t.status === "DONE"
    ).length;
  }

  const pendingTasks = totalTasks - completedTasks;

  // READINESS (READ ONLY — NO CALCULATION HERE)
  const lastTwoReadiness = await ReadinessHistory
    .find({ userId })
    .sort({ date: -1 })
    .limit(2);

  const currentReadiness = lastTwoReadiness[0]?.score || 0;
  const previousReadiness = lastTwoReadiness[1]?.score ?? currentReadiness;
  const delta = currentReadiness - previousReadiness;

  // PERFORMANCE SNAPSHOT (LATEST DAY)
  const latestPerformance = await PerformanceSnapshot
    .findOne({ userId })
    .sort({ date: -1 });

  const performanceSnapshot = latestPerformance
    ? {
      completionRate: latestPerformance.completionRate,
      avgReadinessScore: latestPerformance.avgReadinessScore,
      streak: latestPerformance.streak || 1
    }
    : {
      completionRate: 0,
      avgReadinessScore: 0,
      streak: 0
    };

  // SMART FOCUS MESSAGE (RULE BASED)
  let focusMessage = {
    level: "info",
    priorityScore: 30,
    title: "Stable Performance",
    summary: "Your progress is stable but has room for acceleration.",
    actions: [
      {
        label: "Increase mock frequency",
        reason: "Mocks improve accuracy and confidence"
      }
    ]
  };

  if (totalSkills > 0 && weakSkills / totalSkills > 0.6) {
    focusMessage = {
      level: "danger",
      priorityScore: 90,
      title: "Critical Skill Gaps Detected",
      summary: "More than 60% of your skills are weak.",
      actions: [
        { label: "Revise fundamentals", reason: "Strong basics unlock faster progress" },
        { label: "Pause advanced mocks", reason: "Mocks won’t help without concepts" }
      ]
    };
  }
  else if (totalTasks > 0 && completedTasks / totalTasks < 0.5) {
    focusMessage = {
      level: "warning",
      priorityScore: 70,
      title: "Low Study Consistency",
      summary: "Less than half of your planned tasks are completed.",
      actions: [
        { label: "Finish pending tasks", reason: "Consistency beats intensity" },
        { label: "Reduce daily overload", reason: "Smaller goals increase completion" }
      ]
    };
  }
  else if (delta < 0) {
    focusMessage = {
      level: "warning",
      priorityScore: 60,
      title: "Readiness Declined",
      summary: "Your readiness score dropped compared to last session.",
      actions: [
        { label: "Analyze last mock", reason: "Mistakes reveal weak areas" },
        { label: "Revise core topics", reason: "Prevents repeated errors" }
      ]
    };
  }
  else if (delta > 0) {
    focusMessage = {
      level: "success",
      priorityScore: 40,
      title: "Momentum Building",
      summary: "Your readiness is improving steadily.",
      actions: [
        { label: "Maintain pace", reason: "Consistency compounds progress" },
        { label: "Add one advanced mock", reason: "Test under pressure" }
      ]
    };
  }
  else {
    focusMessage = {
      level: "info",
      priorityScore: 30,
      title: "Stable Performance",
      summary: "Your progress is stable, but there is room to grow.",
      actions: [
        {
          label: "Increase mock frequency",
          reason: "Mocks improve accuracy and time management"
        },
        {
          label: "Mix advanced problems",
          reason: "Gradual difficulty increase prevents stagnation"
        }
      ]
    };
  }

  // FINAL DASHBOARD RESPONSE
  return {
    user: {
      name: user?.name || "User",
      totalSkills,
      weakSkills
    },
    study: {
      totalTasks,
      completedTasks,
      pendingTasks
    },
    readiness: {
      current: currentReadiness,
      last: previousReadiness,
      delta
    },
    mocks: {
      totalMocks: mocks.length
    },
    performanceSnapshot,
    focusMessage
  };
};
