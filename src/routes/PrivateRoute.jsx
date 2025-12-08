import React from "react";
import { Navigate, useLocation } from "react-router";
import useAuth from "../hook/useAuth";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <span className="loading loading-spinner loading-lg text-primary"></span>;
  }
  
  if (user) {
    return children;
  }
  
  return <Navigate to="/login" state={{ from: location }} replace />;
};

export default PrivateRoute;