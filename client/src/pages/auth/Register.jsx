import React, { useContext, useEffect, useState } from "react";
import { assets } from "../../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { AppContent } from "../../context/AppContext";
import GoogleLoginComponent from "../../components/GoogleLogin";

const Register = () => {
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  const { backendUrl, isLoggedIn } = useContext(AppContent);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false); // New loading state

  const handleSubmitt = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Set loading to true when submission starts
    const loadingToastId = toast.loading("Registering your account...");

    try {
      const { data } = await axios.post(backendUrl + "/api/auth/register", {
        fullName,
        email,
        password,
      });

      if (data.success) {
        toast.dismiss(loadingToastId);
        toast.success("Account registered successfully.");

        // Send verification email
        toast.loading("Sending verification email...", { id: "emailVerify" }); // New loading toast for email
        const verifyData = await axios.post(
          backendUrl + "/api/auth/send-verification-email",
          {},
          { withCredentials: true }
        );

        if (verifyData.data.success) {
          toast.dismiss("emailVerify");
          toast.success("Verification email sent!");
          navigate("/email-verify", { state: { email } });
        } else if (verifyData.data.success === false) {
          toast.dismiss("emailVerify");
          toast.error("Failed to send verification email.");
        } else {
          toast.dismiss("emailVerify");
          toast.error(data.message); // If there's a different message from the server
        }
      } else {
        toast.dismiss(loadingToastId);
        toast.error(data.message || "Registration failed."); // Display server message or a generic one
      }
    } catch (error) {
      toast.dismiss(loadingToastId);
      toast.dismiss("emailVerify"); // Dismiss email verification toast if it was shown
      toast.error(error.response?.data?.message || error.message); // Display error message from response or generic
    } finally {
      setIsLoading(false); // Set loading to false after the process completes (success or failure)
    }
  };

  useEffect(() => {
    isLoggedIn && navigate("/");
  }, [isLoggedIn, navigate]);

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center mt-16">
      <div className="w-full max-w-xl">
        <div className="rounded-2xl shadow-2xl p-6 sm:p-8 ">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Create Account
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base">
              Join us and start booking your favorite movies
            </p>
          </div>

          <GoogleLoginComponent />
          <form className="space-y-6" onSubmit={handleSubmitt}>
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-zinc-700"></div>
              <span className="text-xs sm:text-sm text-zinc-500 font-medium whitespace-nowrap">
                Or sign up with email
              </span>
              <div className="flex-1 h-px bg-zinc-700"></div>
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
                    d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle
                    cx="12"
                    cy="7"
                    r="4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <input
                type="text"
                name="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full h-12 pl-12 pr-4 bg-zinc-800 border border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 text-sm sm:text-base text-white placeholder-zinc-400"
                style={{ "--tw-ring-color": "#F84565" }}
                required
                disabled={isLoading} // Disable input when loading
              />
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
                disabled={isLoading} // Disable input when loading
              />
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
                placeholder="Create a password"
                className="w-full h-12 pl-12 pr-4 bg-zinc-800 border border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 text-sm sm:text-base text-white placeholder-zinc-400"
                style={{ "--tw-ring-color": "#F84565" }}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading} // Disable input when loading
              />
            </div>

            <div className="flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                name="agreeTerms"
                className="w-4 h-4 mt-0.5 border-zinc-600 rounded focus:ring-2 bg-zinc-800 checked:bg-red-500 checked:border-red-500"
                style={{
                  "--tw-ring-color": "#F84565",
                  accentColor: "#F84565",
                }}
                disabled={isLoading} // Disable checkbox when loading
              />
              <label className="text-zinc-300 leading-5">
                I agree to the{" "}
                <button
                  type="button"
                  className="font-medium hover:underline hover:opacity-80 transition-opacity"
                  style={{ color: "#F84565" }}
                  disabled={isLoading} // Disable button when loading
                >
                  Terms of Service
                </button>{" "}
                and{" "}
                <button
                  type="button"
                  className="font-medium hover:underline hover:opacity-80 transition-opacity"
                  style={{ color: "#F84565" }}
                  disabled={isLoading} // Disable button when loading
                >
                  Privacy Policy
                </button>
              </label>
            </div>

            <button
              className="w-full h-12 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] hover:opacity-90 cursor-pointer"
              type="submit"
              style={{
                backgroundColor: "#F84565",
                backgroundImage:
                  "linear-gradient(135deg, #F84565 0%, #D63854 100%)",
              }}
              disabled={isLoading} // Disable submit button when loading
            >
              {isLoading ? "Registering..." : "Create Account"}{" "}
              {/* Change button text when loading */}
            </button>

            <p className="text-center text-zinc-400 text-sm sm:text-base">
              Already have an account?{" "}
              <Link
                to={"/login"}
                className="font-semibold hover:underline hover:opacity-80 transition-opacity"
                style={{ color: "#F84565" }}
              >
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
