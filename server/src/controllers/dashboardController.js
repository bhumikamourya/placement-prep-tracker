const { get } = require("mongoose");
const User = require("../models/User");
const {getDashboardSummary} = require("../services/dashboardService");

exports.getDashboardData = async (req ,res) =>{
    try{
        const userId = req.user.id;

        //user
        const user = await User.findById(userId);

        const summary = await getDashboardSummary(userId);

        res.json({
            userName: user.name,
            ...summary
        });
    }catch(error) {
        res.status(500).json({message:"Failed to load dashboard data"});
    }
};