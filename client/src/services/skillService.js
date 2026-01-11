import api from "./api";

export const getSkills = async ()=>{
    const res = await api.get("/skills");
    return res.data;
};

export const addSkill = async(data)=>{
    const res = await api.post("/skills" ,data);
    return res.data;
};

export const updateSkill = async(id, data)=>{
    const res = await api.put(`/skills/${id}`, data);
    return res.data;
};