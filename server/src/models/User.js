const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    name : {
        type: String,
        required : true,
    },
    email : {
        type: String,
        required: true,
        unique: true,
        lowercase : true,
        trim : true
    },
    password: {
        type: String, 
        required: true,
        select : false
    },
    targetRole: {
        type : String,
        enum :["SDE", "Analyst", "DSA", "CS"],
        required: true
    }
},{timestamps: true});

module.exports = mongoose.model("User",userSchema);