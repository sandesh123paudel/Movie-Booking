// AuthContext.js - Simple version for Login and Register
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  // Check if user is logged in on app start
  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");

        if (token && userData) {
          // Basic token expiry check
          const tokenPayload = JSON.parse(atob(token.split(".")[1]));
          const currentTime = Date.now() / 1000;

          if (tokenPayload.exp > currentTime) {
            setUser(JSON.parse(userData));
            setIsAuthenticated(true);
            setIsVerified(JSON.parse(userData).isEmailVerified);
          } else {
            // Token expired, clear storage
            localStorage.removeItem("token");
            localStorage.removeItem("user");
          }
        }
      } catch (error) {
        // Invalid token or data, clear storage
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = (responseData) => {
    // Extract user data and token from your backend response
    const { data } = responseData;
    const { token, ...userData } = data;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
    setIsVerified(userData.isEmailVerified);
  };

  const register = (responseData) => {
    // Extract user data and token from your backend response
    const { data } = responseData;
    const { token, ...userData } = data;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    isVerified,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
