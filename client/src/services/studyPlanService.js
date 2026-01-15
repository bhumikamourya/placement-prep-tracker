import api from "./api";

export const getStudyPlan = async()=>{
    const res = await api.get("/study-plan");
    return res.data;
};

export const markTaskDone = async(taskId)=>{
    const res = await api.patch(`/study-plan/task/${taskId}/complete`);
    return res.data;
};