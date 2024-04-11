import React from "react";
import { jwtDecode } from "jwt-decode";
import { Navigate } from "react-router-dom";

const decodeToken = (token) => {
  return token ? jwtDecode(token) : {};
};

const isExpiredToken = (token) => {
  return token.exp < token.iat;
};

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (token) {
    const decodedToken = decodeToken(token);
    const expired = isExpiredToken(decodedToken);
    if (expired) {
      return <Navigate to="login" />;
    } else {
      return children;
    }
  } else {
    return <Navigate to="login" />;
  }
};

export default PrivateRoute;
