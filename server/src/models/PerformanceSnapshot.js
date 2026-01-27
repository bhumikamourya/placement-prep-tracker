const mongoose = require("mongoose");
const performanceSnapshotSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId, 
        ref: "User",
        required: true
    },
    date :{
        type : Date, 
        required: true
    },
    tasksAssigned : {
        type: Number,
        default: 0
    },
    tasksCompleted :{
        type:Number,
        default: 0
    },
    completionRate: {
        type: Number,
        default: 0 // percentage
    },
     avgReadinessScore: {
        type: Number,
        default: 0
    },
      streak: {
        type: Number,
        default: 1
    }
});

performanceSnapshotSchema.index(
    { userId: 1, date: 1 },
    { unique: true }
);

module.exports = mongoose.model("PerformanceSnapshot" , performanceSnapshotSchema);