const mongoose = require("mongoose");
const skillSchema = new mongoose.Schema({
    userId :{
        type : mongoose.Schema.Types.ObjectId,
        ref : "User", 
        required : true
    },
    category : {
        type : String,
        enum : ["DSA", "CS", "SDE", "Analyst"],
        required : true
    },
    topicName : {
        type : String, 
        required : true
    }, 
    status: {
        type : Number,
        enum: [0,1,2], //0-> Not started, 1-> in progress, 2-> strong
        default: 0
    },
    timeSpent : {
        type : Number, 
        default : 0 //minutes mein
    },
    lastUpdated : {
        type: Date,
        default : Date.now
    },
    // name : {
    //     type : String,
    //     required : true,
    // },
    // level : {
    //     type : Number,
    //     default : 0, // current skill level
    // },
    // requiredLevel :{
    //     type : Number,
    //     default : 7, //placement target
    // },
    // timeSpent : {
    //     type : Number,
    //     default : 0,
    // },
});
module.exports = mongoose.model("Skill", skillSchema);