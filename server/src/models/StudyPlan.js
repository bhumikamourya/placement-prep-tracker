const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    topic : String,
    category : String, 
    estimatedTime : Number,
    priority :{
        type: String , 
        enum : ['HIGH', 'MEDIUM' , 'LOW'],
    },
    status : {
        type : String,
        enum : ['PENDING' , 'DONE'],
        default : 'PENDING'
    }
});

const studyPlanSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    date : {
        type : String , 
        required : true
    },
    tasks : [taskSchema],
    createdAt : {
        type : Date,
        default : Date.now
    }
});

module.exports = mongoose.model("StudyPlan", studyPlanSchema);