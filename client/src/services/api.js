import axios from "axios";
import {getToken} from "../utils/Token";
const api = axios.create({
    baseURL:"http://localhost:5000/api"
});
api.interceptors.request.use((req) => {
    const token = getToken();
    if(token) req.headers.Authorization = `Bearer ${token}`;
    return req;
});
export default api;