const User = require("../models/User");
const {getDashboardOverview} = require("../services/dashboardService");

exports.getDashboardData = async (req ,res) =>{
    try{

        //user
        // const user = await User.findById(userId);

        const data = await getDashboardOverview(req.user.id);

        res.json(data);
    }catch(error) {
        res.status(500).json({message:"Failed to load dashboard data"});
    }
};