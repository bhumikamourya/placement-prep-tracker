import api from "./api";
export const getPerformanceAnalytics = async ()=>{
    const res = await api.get("/performance");
    return res.data;
};