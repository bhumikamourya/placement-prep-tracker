import api from "./api";

export const getSkillGap = async()=>{
    const res = await api.get("/skill-gap");
    return res.data;
};