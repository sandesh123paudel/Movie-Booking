// api.js - Simple version for Login and Register only
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/auth"; // Change this to your server URL

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 second timeout
});

// Add request interceptor to automatically add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Login function
export const loginUser = async (email, password) => {
  try {
    const response = await api.post("/login", { email, password });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Login failed");
  }
};

// Register function
export const registerUser = async (fullName, email, password) => {
  try {
    const response = await api.post("/register", { fullName, email, password });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Registration failed");
  }
};

// Email verification function
export const verifyEmail = async (token) => {
  try {
    const response = await api.get(`/verify-email/${token}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Email verification failed"
    );
  }
};

// Send verification email function
export const sendVerificationEmail = async (email) => {
  try {
    const response = await api.post("/send-verification", { email });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to send verification email"
    );
  }
};

// Logout function
export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// Export the axios instance for custom requests
export default api;
