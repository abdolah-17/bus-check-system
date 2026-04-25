import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    // If not logged in, redirect to login page
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If user role is not allowed, redirect to a default safe page
    // For example, if a supervisor tries to access a manager-only page
    return <Navigate to={user.role === "manager" ? "/create-trip" : "/boarding-check"} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
