// src/pages/auth/Login.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/AuthContext"; // Adjust path as needed
import { loginUser, sendVerificationEmail } from "../../api"; // Import sendVerificationEmail separately
import toast from "react-hot-toast"; // Import toast

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showVerificationPrompt, setShowVerificationPrompt] = useState(false);

  const { login } = useAuth(); // Destructure the login function from AuthContext
  const navigate = useNavigate();

  const handleInput = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setShowVerificationPrompt(false);

    try {
      const response = await loginUser(formData.email, formData.password);

      if (response.success) {
        // IMPORTANT: Ensure your backend response for login includes `isVerified`
        // e.g., response.data = { token: '...', user: { _id: '...', email: '...', isVerified: true/false, ... } }
        const { user } = response.data; // Assuming user data is nested under 'data'

        login(response); // Update AuthContext state and localStorage

        if (user && !user.isEmailVerified) {
          console.log("User not verified, showing prompt"); // Debug log
          setShowVerificationPrompt(true);
          toast.error("Please verify your email to access all features.");
          // Don't navigate yet - let user choose
        } else {
          console.log("User verified, redirecting to home"); // Debug log
          toast.success(response.message || "Logged In Successfully!");
          navigate("/"); // Redirect to home page if verified
        }
      } else {
        // If backend explicitly says not successful but doesn't throw an error
        throw new Error(
          response.message || "Login failed. Please check your credentials."
        );
      }
    } catch (err) {
      const errorMessage =
        err.message || "An unexpected error occurred during login.";
      setError(errorMessage);
      toast.error(errorMessage);

      // Check if error is related to email verification
      if (
        errorMessage.toLowerCase().includes("verify") ||
        errorMessage.toLowerCase().includes("verification")
      ) {
        setShowVerificationPrompt(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEmail = async () => {
    try {
      // Call API to send verification email - Fixed: Use the imported function
      const response = await sendVerificationEmail(formData.email);
      if (response.success) {
        toast.success(response.message || "Verification email sent!");
      } else {
        throw new Error(
          response.message || "Failed to send verification email."
        );
      }
    } catch (err) {
      toast.error(err.message || "Error sending verification email.");
    }
  };

  const handleContinueWithoutVerification = () => {
    setShowVerificationPrompt(false);
    navigate("/"); // Navigate to home but with limited access
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center mt-16">
      <div className="w-full max-w-xl">
        {/* Login Form */}
        <div className="rounded-2xl shadow-2xl p-6 sm:p-8 ">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Welcome Back!
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base">
              Sign in to your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Google Sign In Button */}
            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 h-12 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-xl transition-all duration-200 hover:shadow-lg"
              disabled={loading}
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                {/* SVG path for Google icon */}
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
                Continue with Google
              </span>
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-zinc-700"></div>
              <span className="text-xs sm:text-sm text-zinc-500 font-medium whitespace-nowrap">
                Or sign in with email
              </span>
              <div className="flex-1 h-px bg-zinc-700"></div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Debug info - remove this in production */}
            {showVerificationPrompt && (
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-2 mb-2">
                <p className="text-blue-400 text-xs">
                  Debug: Verification prompt is active
                </p>
              </div>
            )}

            {/* Email Verification Prompt */}
            {showVerificationPrompt && (
              <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-orange-400 flex-shrink-0"
                  >
                    <path
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <p className="text-orange-400 text-sm font-medium">
                    Email Verification Required
                  </p>
                </div>
                <p className="text-orange-300 text-sm mb-4">
                  Your account needs to be verified to access all features.
                  Please verify your email address to continue.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={handleVerifyEmail}
                    className="flex-1 h-10 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors duration-200 text-sm"
                  >
                    Send Verification Email
                  </button>
                  <button
                    type="button"
                    onClick={handleContinueWithoutVerification}
                    className="flex-1 h-10 bg-zinc-700 hover:bg-zinc-600 text-zinc-200 font-medium rounded-lg transition-colors duration-200 text-sm"
                  >
                    Continue Anyway
                  </button>
                </div>
              </div>
            )}

            {/* Email Input */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
                {/* Email SVG icon */}
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <polyline
                    points="22,6 12,13 2,6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInput}
                placeholder="Enter your email"
                className="w-full h-12 pl-12 pr-4 bg-zinc-800 border border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 text-sm sm:text-base text-white placeholder-zinc-400"
                style={{ "--tw-ring-color": "#F84565" }}
                required
                disabled={loading}
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
                {/* Password SVG icon */}
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="3"
                    y="11"
                    width="18"
                    height="11"
                    rx="2"
                    ry="2"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <circle
                    cx="12"
                    cy="16"
                    r="1"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M7 11V7a5 5 0 0 1 10 0v4"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInput}
                placeholder="Enter your password"
                className="w-full h-12 pl-12 pr-4 bg-zinc-800 border border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 text-sm sm:text-base text-white placeholder-zinc-400"
                style={{ "--tw-ring-color": "#F84565" }}
                required
                disabled={loading}
              />
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-sm font-medium hover:underline hover:opacity-80 transition-opacity"
                style={{ color: "#F84565" }}
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full h-12 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] hover:opacity-90"
              style={{
                backgroundColor: "#F84565",
                backgroundImage:
                  "linear-gradient(135deg, #F84565 0%, #D63854 100%)",
              }}
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign in"}
            </button>

            {/* Register Link */}
            <p className="text-center text-zinc-400 text-sm sm:text-base">
              Don't have an account?{" "}
              <Link
                to={"/register"}
                className="font-semibold hover:underline hover:opacity-80 transition-opacity"
                style={{ color: "#F84565" }}
              >
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
