import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function RequireAuth({ children }) {
  const { user, loading } = useContext(AuthContext);
  const loc = useLocation();

  const adminToken = localStorage.getItem("admin_token");

  if (loading) return <div>Loading...</div>;

  if (!user && !adminToken) {
    return <Navigate to="/login" state={{ from: loc }} replace />;
  }

  return children;
}
