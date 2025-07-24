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
      render={({ onClick, disabled }) => (
        <button
          onClick={onClick}
          disabled={disabled || isLoading}
          type="button"
          className="w-full flex items-center justify-center gap-3 h-12 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-xl transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {/* Google Icon SVG */}
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span className="font-medium text-zinc-200 text-sm sm:text-base">
            {isLoading ? "Signing in..." : "Continue with Google"}
          </span>
        </button>
      )}
    />
  );
};

export default GoogleLoginComponent;
