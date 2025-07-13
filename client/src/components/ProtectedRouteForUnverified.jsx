// src/components/ProtectedRouteForUnverified.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/AuthContext"; // Adjust path as needed
import toast from "react-hot-toast";

const ProtectedRouteForUnverified = () => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <div>Loading authentication...</div>; // Or a spinner
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    toast.error("Please log in to verify your email.");
    return <Navigate to="/login" replace />;
  }

  // If authenticated AND verified, redirect to home
  // This assumes your 'user' object from backend/AuthContext has an 'isVerified' field.
  // Make sure your backend sends this and your AuthContext stores it.
  if (isAuthenticated && user?.isVerified) {
    toast.success("Your email is already verified!");
    return <Navigate to="/" replace />;
  }

  // If authenticated but NOT verified, allow access to the nested route (VerifyEmail)
  return <Outlet />;
};

export default ProtectedRouteForUnverified;
