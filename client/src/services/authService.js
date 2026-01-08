import api from "./api";
import { setToken } from "../utils/Token";

export const login = async (data)=>{
    const res = await api.post("/auth/login", data);
    setToken(res.data.token);
    return res.data;
};
export const register = async(data)=>{
    const res = await api.post("/auth/register", data);
    return res.data;
};