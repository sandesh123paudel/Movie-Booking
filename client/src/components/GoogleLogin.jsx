import axios from "axios";
import React, { useContext } from "react";
import { GoogleLogin } from "@react-oauth/google"; // Import GoogleLogin
import toast from "react-hot-toast"; // Ensure toast is imported if used
import { useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContext";

const GoogleLoginComponent = ({ isLoading }) => {
  const navigate = useNavigate();
  const { backendUrl, setIsLoggedIn, getUserData } = useContext(AppContent);

  const handleSuccess = async (credentialResponse) => {
    let googleLoginToastId = toast.loading("Signing in with Google...");

    try {
      axios.defaults.withCredentials = true;

      const { data } = await axios.post(
        backendUrl + "/api/auth/google",
        { token: credentialResponse.credential },
        { withCredentials: true }
      );

      if (data.success) {
        setIsLoggedIn(true);
        toast.success(data.message || "Google login successful", {
          id: googleLoginToastId,
        });
        await getUserData();
        navigate("/");
      } else {
        toast.error(data.message || "Google login failed", {
          id: googleLoginToastId,
        });
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Google login failed. Please try again.",
        { id: googleLoginToastId }
      );
    }
  };

  const handleError = () => {
    toast.error("Google login failed");
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={handleError}
      locale="en"
      shape="pill"
      size="large"
      text="continue_with"
      theme="filled_black"
      useOneTap
      auto_select
      render={({ onClick, disabled }) => (
        <button
          onClick={onClick}
          disabled={disabled || isLoading}
          className={`flex items-center justify-center gap-3 w-full py-3 px-6 rounded-full transition-all
            ${
              disabled || isLoading
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-primary hover:bg-primary-dull shadow-md hover:shadow-lg"
            }
          `}
        >
          <svg width="22" height="22" viewBox="0 0 24 24">
            {/* SVG paths remain the same */}
          </svg>
          <span
            className={`font-semibold text-lg ${
              disabled || isLoading ? "text-gray-500" : "text-white"
            }`}
          >
            {isLoading ? "Processing..." : "Sign in with Google"}
          </span>
        </button>
      )}
    />
  );
};

export default GoogleLoginComponent;
