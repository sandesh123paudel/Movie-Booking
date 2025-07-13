// src/pages/auth/VerifyEmail.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { verifyEmail, sendVerificationEmail } from "../../api";
import { useAuth } from "../../hooks/AuthContext";
import toast from "react-hot-toast";

const VerifyEmail = () => {
  const { token } = useParams(); // Get token from URL
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [verificationStatus, setVerificationStatus] = useState("loading"); // loading, success, error
  const [error, setError] = useState("");
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (token) {
      // If there's a token in the URL, verify it automatically
      handleVerifyEmail(token);
    } else {
      // If no token, show manual verification page
      setVerificationStatus("manual");
    }
  }, [token]);

  const handleVerifyEmail = async (verificationToken) => {
    try {
      setVerificationStatus("loading");
      const response = await verifyEmail(verificationToken);

      if (response.success) {
        setVerificationStatus("success");
        toast.success("Email verified successfully!");

        // Update user verification status in AuthContext
        if (user) {
          updateUser({ ...user, isEmailVerified: true });
        }

        // Redirect to home page after 3 seconds
        setTimeout(() => {
          navigate("/");
        }, 3000);
      } else {
        throw new Error(response.message || "Verification failed");
      }
    } catch (err) {
      setVerificationStatus("error");
      setError(err.message || "Email verification failed");
      toast.error(err.message || "Email verification failed");
    }
  };

  const handleResendVerification = async () => {
    if (!user?.email) {
      toast.error("No email found. Please log in again.");
      return;
    }

    try {
      setIsResending(true);
      console.log("Sending verification email to:", user.email); // Debug log
      const response = await sendVerificationEmail(user.email);
      console.log("Verification email response:", response); // Debug log

      if (response.success) {
        toast.success("Verification email sent! Please check your inbox.");
      } else {
        throw new Error(
          response.message || "Failed to send verification email"
        );
      }
    } catch (err) {
      console.error("Verification email error:", err); // Debug log
      toast.error(err.message || "Failed to send verification email");
    } finally {
      setIsResending(false);
    }
  };

  const renderContent = () => {
    switch (verificationStatus) {
      case "loading":
        return (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Verifying Email...
            </h2>
            <p className="text-zinc-400">
              Please wait while we verify your email address.
            </p>
          </div>
        );

      case "success":
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-white"
              >
                <path
                  d="M20 6L9 17l-5-5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Email Verified!
            </h2>
            <p className="text-zinc-400 mb-4">
              Your email has been successfully verified. You now have full
              access to all features.
            </p>
            <p className="text-sm text-zinc-500">
              Redirecting to home page in 3 seconds...
            </p>
          </div>
        );

      case "error":
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-white"
              >
                <line
                  x1="18"
                  y1="6"
                  x2="6"
                  y2="18"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <line
                  x1="6"
                  y1="6"
                  x2="18"
                  y2="18"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Verification Failed
            </h2>
            <p className="text-red-400 mb-4">{error}</p>
            <div className="space-y-3">
              <button
                onClick={handleResendVerification}
                disabled={isResending}
                className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50"
              >
                {isResending ? "Sending..." : "Resend Verification Email"}
              </button>
              <Link
                to="/login"
                className="block w-full h-12 bg-zinc-700 hover:bg-zinc-600 text-white font-medium rounded-lg transition-colors duration-200 text-center leading-12"
              >
                Back to Login
              </Link>
            </div>
          </div>
        );

      case "manual":
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-white"
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
            <h2 className="text-2xl font-bold text-white mb-2">
              Check Your Email
            </h2>
            <p className="text-zinc-400 mb-4">
              We've sent a verification link to your email address. Please check
              your inbox and click the link to verify your account.
            </p>
            {user?.email && (
              <p className="text-sm text-zinc-500 mb-6">
                Sent to: <span className="text-white">{user.email}</span>
              </p>
            )}
            <div className="space-y-3">
              <button
                onClick={handleResendVerification}
                disabled={isResending}
                className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50"
              >
                {isResending ? "Sending..." : "Resend Verification Email"}
              </button>
              <Link
                to="/"
                className="block w-full h-12 bg-zinc-700 hover:bg-zinc-600 text-white font-medium rounded-lg transition-colors duration-200 text-center leading-12"
              >
                Continue to Dashboard
              </Link>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-zinc-900 rounded-2xl shadow-2xl p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
