import api from "./api";

export const generateStudyPlan = async()=>{
    const res = await api.post("/study-plan/generate");
    return res.data;
}

export const getStudyPlan = async()=>{
    const res = await api.get("/study-plan");
    return res.data;
};

export const markTaskDone = async(taskId)=>{
    const res = await api.patch(`/study-plan/task/${taskId}/complete`);
    return res.data;
};