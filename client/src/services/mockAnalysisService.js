import api from "./api";

export const getMockAnalysis = async () =>{
    const res = await api.get("/mocks/analysis");
    return res.data;
};