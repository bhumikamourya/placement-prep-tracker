const {getDashboardOverview} = require("../services/dashboardService");
const {calculateReadiness} = require("./readinessController");

exports.getDashboardData = async (req ,res) =>{
    try{
        //recalculate rediness for today
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