const User = require("../models/User");
const {getDashboardOverview} = require("../services/dashboardService");
const {calculateReadiness} = require("./readinessController");

exports.getDashboardData = async (req ,res) =>{
    try{

        await calculateReadiness(req, {
            json: ()=>{},
            status: ()=>({json: ()=>{}})
        });
        const data = await getDashboardOverview(req.user.id);

        res.json(data);
    }catch(error) {
        res.status(500).json({message:"Failed to load dashboard data"});
    }
};