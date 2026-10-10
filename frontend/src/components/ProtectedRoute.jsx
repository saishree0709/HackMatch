import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <div className="spinner" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // If student tries to access organizer page, redirect to student dashboard
    if (user?.role === "STUDENT") {
      return <Navigate to="/student/dashboard" replace />;
    }
    // If organizer tries to access student page, redirect to organizer dashboard
    if (user?.role === "ORGANIZER") {
      return <Navigate to="/organizer/dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return children;
};
