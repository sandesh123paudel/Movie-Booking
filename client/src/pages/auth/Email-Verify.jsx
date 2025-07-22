import React, { useContext, useEffect, useState } from "react";
import { assets } from "../../assets/assets";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { AppContent } from "../../context/AppContext";

const EmailVerification = () => {
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
  const location = useLocation();
  const email = location.state?.email;

  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false); // New loading state for all actions
  const { backendUrl, isLoggedIn, userData, getUserData } =
    useContext(AppContent);

  const handleSubmitt = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Set loading to true
    const loadingToastId = toast.loading("Verifying your email...");

    try {
      // Send the OTP to the backend
      const { data } = await axios.post(backendUrl + "/api/auth/verify-email", {
        otp,
        email,
      });

      if (data.success) {
        toast.success(data.message || "Email verified successfully!", {
          id: loadingToastId,
        });
        // After successful verification, refresh user data to update isVerified status
        await getUserData();
        navigate("/"); // Navigate to home or dashboard after successful verification
      } else {
        toast.error(data.message || "Email verification failed.", {
          id: loadingToastId,
        });
      }
    } catch (error) {
      // Handle network errors or specific backend errors
      toast.error(
        error.response?.data?.message ||
          "An error occurred during verification. Please try again.",
        {
          id: loadingToastId,
        }
      );
    } finally {
      setIsLoading(false); // Set loading to false after completion
    }
  };

  const resendOtpHandler = async () => {
    setIsLoading(true); // Set loading to true for resend
    const resendLoadingToastId = toast.loading("Resending OTP...");
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(
        backendUrl + "/api/auth/send-verification-email",
        {}
      );
      if (data.success) {
        toast.success(data.message || "New verification code sent!", {
          id: resendLoadingToastId,
        });
      } else {
        toast.error(data.message || "Failed to resend OTP.", {
          id: resendLoadingToastId,
        });
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Error resending OTP. Please try again.",
        {
          id: resendLoadingToastId,
        }
      );
    } finally {
      setIsLoading(false); // Set loading to false after completion
    }
  };

  useEffect(() => {
    if (isLoggedIn && userData?.isVerified) {
      navigate("/");
    } else if (isLoggedIn && !userData?.isVerified) {
      // If logged in but not verified, ensure they are on this page
      // And if email from state is missing, try to use userData's email
      if (!email && userData?.email) {
        navigate("/email-verify", { state: { email: userData.email } });
      }
    } else if (!email && !isLoggedIn) {
      // If not logged in and no email in state, redirect to login
      navigate("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, userData, navigate, email]); // Added email to dependency array

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="w-full max-w-xl">
        <div className=" rounded-2xl shadow-2xl p-6 sm:p-8 ">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Verify your Code
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base">
              Enter your code we have sent your email.
              {email && (
                <span className="font-semibold text-white ml-1">({email})</span>
              )}
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmitt}>
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
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                name="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter your OTP"
                className="w-full h-12 pl-12 pr-4 bg-zinc-800 border border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 text-sm sm:text-base text-white placeholder-zinc-400"
                style={{ "--tw-ring-color": "#F84565" }}
                required
                maxLength={6}
                disabled={isLoading}
              />
            </div>

            {/* Submit Button */}
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
              {isLoading ? "Verifying..." : "Verify"} {/* Change button text */}
            </button>

            {/* Resend OTP */}
            <p className="text-center text-zinc-400 text-sm sm:text-base">
              Didn't receive the code or it expired?{" "}
              <button
                type="button"
                onClick={resendOtpHandler}
                className="font-semibold hover:underline hover:opacity-80 transition-opacity"
                style={{ color: "#F84565" }}
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Resend Code"}{" "}
                {/* Change button text */}
              </button>
            </p>

            {/* Back to Home */}
            <p className="text-center text-zinc-400 text-sm sm:text-base">
              Continue without verification?{" "}
              <button // Changed from Link to button
                type="button" // Important: set to type="button" to prevent form submission
                onClick={() => {
                  navigate("/"); // Navigate to home
                  getUserData(); // Call getUserData to refresh user details in context
                }}
                className="font-semibold hover:underline hover:opacity-80 transition-opacity cursor-pointer"
                style={{ color: "#F84565" }}
                disabled={isLoading} // Disable if an API call is ongoing
              >
                Back to Home
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
