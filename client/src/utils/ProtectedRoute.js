import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getToken } from "./Token.js";
const ProtectedRoute = ({ children }) => {
   const [loading, setLoading] = useState(true);
   const [isAuth, setisAuth] = useState(false);

   useEffect(()=>{
      const token = getToken()
      if(token) {
         setisAuth(true);
      }
      setLoading(false);
   },[]);
   if(loading) return <p>Checking authentication...</p>;

   return isAuth ? children : <Navigate to={"/login" } replace/>;
};
export default ProtectedRoute;