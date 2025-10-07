import React from "react"
import { Navigate } from "react-router-dom"

export default function RequireAdmin({ children }) {
  const adminToken = localStorage.getItem("admin_token")

  if (!adminToken || adminToken.trim() === "") {
    return <Navigate to="/admin" replace />
  }

  return children
}
