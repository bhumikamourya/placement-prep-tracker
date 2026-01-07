const mongoose = require("mongoose");
const {MONGO_URL} = require("./env");

const connectDB = async()=>{
    try{
        await mongoose.connect(MONGO_URL);
        console.log("MongoDB Connected");
    }catch(err){
        console.error("MongoDB Connection error:", err);
        process.exit(1);
    }
};
module.exports = connectDB;