import api from "./api";

export const getReadiness = async () =>{
    const res = await api.get("/readiness");
    return res.data;
}


