const mongoose = require("mongoose");
const mockTestSchema = new mongoose.Schema({
    userId :{
        type: mongoose.Schema.Types.ObjectId,
        ref : "User",
        required: true
    },
    topic : {
        type:String, 
        required : true
    },
    totalQuestions : {
        type : Number,
        required : true
    },
    correctAnswers:{
        type : Number, 
        required : true
    },
    date :{
        type :Date,
        required : true
    }
});

module.exports = mongoose.model("MockTest" , mockTestSchema);