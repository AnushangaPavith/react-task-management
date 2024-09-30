import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Import your auth hook or context
import { useState } from "react";

const PrivateRoute = ({ children, allowedRoles }) => {


    const getUserIdFromToken = () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          const currentTime = Date.now() / 1000; // Current time in seconds
        if (decodedToken.exp < currentTime) {
          // Token is expired
          localStorage.clear();
          return { role: null, expired: true };
        }
        return { role: decodedToken.role, expired: false }; // Adjust according to your token structure
          
        } catch (error) {
          console.error("Error decoding token:", error);
          return { role: null, expired: true };
        }
      }
      return { role: null, expired: true };
    };
  
    const { role, expired } = getUserIdFromToken();

    if(role){
        localStorage.setItem("User_role",role);
    }

    if(expired){
        return <Navigate to="/" replace />;
    }else if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/staff" replace />;
  }

  return children;
};

export default PrivateRoute;
