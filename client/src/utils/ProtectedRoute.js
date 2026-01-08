import {Navigate} from "react-router-dom";
import {getToken} from "./Token";
 const ProtectedRoute = ({childern}) =>{
    const token = getToken();
    return token ? childern : <Navigate to="/login"/>;
 };
 export default ProtectedRoute;