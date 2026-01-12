import api from "./api";

export const getReadiness = async () =>{
    const res = await api.get("/readiness");
    return res.data;
}

export const getSkillGap = async () =>{
    const res = await api.get("/skill-gap");
    return res.data;
};