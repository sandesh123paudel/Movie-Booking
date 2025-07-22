import React, { useState, useContext, useEffect } from "react"; // Import useEffect
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { AppContent } from "../../context/AppContext"; // Assuming AppContent provides backendUrl

const ForgetPassword = () => {
  const navigate = useNavigate();
  axios.defaults.withCredentials = true; // Ensure cookies are sent with requests

  const { backendUrl, isLoggedIn } = useContext(AppContent); // Get backendUrl and isLoggedIn from context

  // State for form steps and data
  const [currentStep, setCurrentStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Loading state for API calls

  // Handler for sending the password reset email (Step 1)
  const handleSendResetLink = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const toastId = toast.loading("Sending Password Reset code...");

    try {
      const { data } = await axios.post(
        backendUrl + "/api/auth/send-passwordReset-email",
        { email }
      );

      if (data.success) {
        toast.success(data.message || "Reset link sent to your email!", {
          id: toastId,
        });
        setCurrentStep(2); // Move to OTP verification step
      } else {
        toast.error(data.message || "Failed to send reset link.", {
          id: toastId,
        });
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again.",
        { id: toastId }
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for verifying OTP and setting new password (Step 2 & 3 combined into one API call)
  const handleVerifyAndResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    const toastId = toast.loading("Verifying code and resetting password...");

    try {
      // The API endpoint /reset-password is expected to handle both OTP verification
      // and setting the new password.
      const { data } = await axios.post(
        backendUrl + "/api/auth/reset-password",
        { email, otp, newPassword }
      );

      if (data.success) {
        toast.success(data.message || "Password reset successfully!", {
          id: toastId,
        });
        setCurrentStep(3); // Move to the final confirmation/success view
        setTimeout(() => {
          navigate("/login"); // Navigate to login after a short delay
        }, 2000);
      } else {
        toast.error(
          data.message || "Password reset failed. Invalid code or email.",
          { id: toastId }
        );
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again.",
        { id: toastId }
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for resending OTP (if user is on Step 2 and needs a new code)
  const handleResendOtp = async () => {
    setIsLoading(true);
    const toastId = toast.loading("Resending OTP...");

    try {
      const { data } = await axios.post(
        backendUrl + "/api/auth/send-passwordReset-email",
        { email } // Send email again to request a new OTP
      );

      if (data.success) {
        toast.success(data.message || "New reset code sent!", { id: toastId });
      } else {
        toast.error(data.message || "Failed to resend OTP.", { id: toastId });
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Error resending OTP. Please try again.",
        { id: toastId }
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Effect to redirect if user is already logged in
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]); // Dependencies: isLoggedIn and navigate

  const renderFormStep = () => {
    switch (currentStep) {
      case 1: // Enter Email
        return (
          <form className="space-y-6" onSubmit={handleSendResetLink}>
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                Forgot Password?
              </h2>
              <p className="text-zinc-400 text-sm sm:text-base">
                Enter your email and we’ll send you a reset link.
              </p>
            </div>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full h-12 pl-12 pr-4 bg-zinc-800 border border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 text-sm sm:text-base text-white placeholder-zinc-400"
                style={{ "--tw-ring-color": "#F84565" }}
                required
                disabled={isLoading}
              />
            </div>
            <button
              type="submit"
              className="w-full h-12 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] hover:opacity-90"
              style={{
                backgroundColor: "#F84565",
                backgroundImage:
                  "linear-gradient(135deg, #F84565 0%, #D63854 100%)",
              }}
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </button>
            <p className="text-center text-zinc-400 text-sm sm:text-base">
              Remember your password?{" "}
              <Link
                to="/login"
                className="font-semibold hover:underline hover:opacity-80 transition-opacity"
                style={{ color: "#F84565" }}
              >
                Back to Sign In
              </Link>
            </p>
          </form>
        );

      case 2: // Enter OTP and New Password
        return (
          <form className="space-y-6" onSubmit={handleVerifyAndResetPassword}>
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                Verify Code & Reset Password
              </h2>
              <p className="text-zinc-400 text-sm sm:text-base">
                We sent a code to{" "}
                <span className="font-semibold text-white">{email}</span>. Enter
                it below.
              </p>
            </div>
            {/* OTP Input */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
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
                type="number"
                inputMode="numeric"
                pattern="[0-9]*"
                name="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                className="w-full h-12 pl-12 pr-4 bg-zinc-800 border border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 text-sm sm:text-base text-white placeholder-zinc-400"
                style={{ "--tw-ring-color": "#F84565" }}
                required
                maxLength={6}
                disabled={isLoading}
              />
            </div>

            {/* New Password Input */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
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
                name="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full h-12 pl-12 pr-4 bg-zinc-800 border border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 text-sm sm:text-base text-white placeholder-zinc-400"
                style={{ "--tw-ring-color": "#F84565" }}
                required
                disabled={isLoading}
              />
            </div>

            {/* Confirm New Password Input */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
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
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full h-12 pl-12 pr-4 bg-zinc-800 border border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 text-sm sm:text-base text-white placeholder-zinc-400"
                style={{ "--tw-ring-color": "#F84565" }}
                required
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              className="w-full h-12 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] hover:opacity-90 cursor-pointer"
              style={{
                backgroundColor: "#F84565",
                backgroundImage:
                  "linear-gradient(135deg, #F84565 0%, #D63854 100%)",
              }}
              disabled={isLoading}
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </button>

            <p className="text-center text-zinc-400 text-sm sm:text-base">
              Didn't receive the code?{" "}
              <button
                type="button"
                onClick={handleResendOtp}
                className="font-semibold hover:underline hover:opacity-80 transition-opacity"
                style={{ color: "#F84565" }}
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Resend Code"}
              </button>
            </p>
            <p className="text-center text-zinc-400 text-sm sm:text-base">
              <Link
                to="/login"
                className="font-semibold hover:underline hover:opacity-80 transition-opacity"
                style={{ color: "#F84565" }}
              >
                Back to Sign In
              </Link>
            </p>
          </form>
        );

      case 3: // Success Message
        return (
          <div className="text-center space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Password Reset Successful!
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base">
              Your password has been successfully reset. You will be redirected
              to the login page shortly.
            </p>
            <Link
              to="/login"
              className="font-semibold hover:underline hover:opacity-80 transition-opacity"
              style={{ color: "#F84565" }}
            >
              Go to Login
            </Link>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="w-full max-w-xl">
        <div className="rounded-2xl shadow-2xl p-6 sm:p-8 ">
          {renderFormStep()}
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
