// src/components/PublicRoute.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/AuthContext"; // Adjust path as needed
import Loading from "./Loading";

const PublicRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  // Show a loading indicator or null while authentication status is being checked
  if (loading) {
    return <Loading />; // Or a more sophisticated spinner/loader
  }

  // If the user is authenticated, redirect them away from public pages
  // You can choose where to redirect them, e.g., to the home page or a dashboard
  if (isAuthenticated) {
    return <Navigate to="/" replace />; // Redirect to home page if logged in
  }

  // If the user is not authenticated, render the children (the public page)
  return <Outlet />;
};

export default PublicRoute;
