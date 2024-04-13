import React from "react";
import { Navigate } from "react-router-dom";
import { getCookie, deleteCookie, isExpiredToken } from '../utils/functions';
const PrivateRoute = ({ children }) => {
  const token = getCookie("token");
  if (token) {
    const expired = isExpiredToken(token);
    if (expired) {
      deleteCookie("token");
      return <Navigate to="login" />;
    } else {
      return children;
    }
  } else {
    deleteCookie("token");
    return <Navigate to="login" />;
  }
};

export default PrivateRoute;
