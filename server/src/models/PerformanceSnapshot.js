const mongoose = require("mongoose");
const performanceSnapshotSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId, 
        ref: "User"
    },
    date :{
        type : Date, 
        default : Date.now
    },
    tasksAssigned : Number,
    tasksCompleted : Number, 
    completionRate : Number, // in % 
    avgReadinessScore : Number
});
module.exports = mongoose.model("PerformanceSnapshot" , performanceSnapshotSchema);