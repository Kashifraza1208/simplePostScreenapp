import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.user);
  // Check if the user is not authenticated and redirect to the login page
  if (isAuthenticated === false) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
