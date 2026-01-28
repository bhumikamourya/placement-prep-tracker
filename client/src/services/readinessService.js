import api from "./api";

export const getLatestReadiness = async () =>{
    const res = await api.get("/readiness/latest");
    return res.data;
}
export const getReadinessTrend = async()=>{
    const res= await api.get("/readiness/trend");
    return res.data;
}
export const getReadinessExplanation = async()=>{
    const res = await api.get("/readiness/explain");
    return res.data;
}