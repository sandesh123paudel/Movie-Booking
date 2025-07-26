import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { AppContent } from "../../context/AppContext";
import GoogleLoginComponent from "../../components/GoogleLogin";

const Login = () => {
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
  const { backendUrl, isLoggedIn, setIsLoggedIn, getUserData } =
    useContext(AppContent);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false); // New loading state

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Set loading to true when submission starts

    let loginToastId = toast.loading("Logging in..."); // Show loading toast and store its ID

    try {
      axios.defaults.withCredentials = true;

      const { data } = await axios.post(backendUrl + "/api/auth/login", {
        email,
        password,
      });

      if (data.success) {
        setIsLoggedIn(true);
        // Update the loading toast to a success toast
        toast.success(data.message, { id: loginToastId });
        await getUserData(); // Ensure user data is fetched
        navigate("/");
      } else {
        // Update the loading toast to an error toast
        toast.error(data.message, { id: loginToastId });
      }
    } catch (error) {
      // If an error occurs (e.g., network error), dismiss/update the toast to error
      toast.error(
        error.response?.data?.message ||
          "An unexpected error occurred. Please try again.",
        {
          id: loginToastId,
        }
      );
    } finally {
      setIsLoading(false); // Always set loading to false after the process completes
    }
  };

  useEffect(() => {
    isLoggedIn && navigate("/");
  }, [isLoggedIn, navigate]);

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center mt-16">
      <div className="w-full max-w-xl">
        {/* Login Form */}
        <div className="rounded-2xl shadow-2xl px-6 sm:px-8 ">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Welcome Back
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base">
              Sign in to your account to continue
            </p>
          </div>

          <form className="flex flex-col space-y-6" onSubmit={handleSubmit}>
            {/* Email Input */}
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
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full h-12 pl-12 pr-4 bg-zinc-800 border border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 text-sm sm:text-base text-white placeholder-zinc-400"
                style={{ "--tw-ring-color": "#F84565" }}
                disabled={isLoading} // Disable input when loading
              />
            </div>

            {/* Password Input */}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                className="w-full h-12 pl-12 pr-4 bg-zinc-800 border border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 text-sm sm:text-base text-white placeholder-zinc-400"
                style={{ "--tw-ring-color": "#F84565" }}
                disabled={isLoading} // Disable input when loading
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="rememberMe"
                  className="w-4 h-4 border-zinc-600 rounded focus:ring-2 bg-zinc-800 checked:bg-red-500 checked:border-red-500"
                  style={{
                    "--tw-ring-color": "#F84565",
                    accentColor: "#F84565",
                  }}
                  disabled={isLoading} // Disable checkbox when loading
                />
                <span className="text-zinc-300">Remember me</span>
              </label>
              <Link
                to="/reset-password"
                className="text-red-400 hover:text-red-300 font-medium hover:underline"
                style={{ color: "#F84565" }}
                // You might consider disabling this if `isLoading` true, depending on desired UX
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit" // Ensure this is type="submit"
              className="w-full h-12 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] hover:opacity-90 cursor-pointer"
              style={{
                backgroundColor: "#F84565",
                backgroundImage:
                  "linear-gradient(135deg, #F84565 0%, #D63854 100%)",
              }}
              disabled={isLoading} // Disable button when loading
            >
              {isLoading ? "Signing In..." : "Sign In"} {/* Conditional text */}
            </button>

            {/* Sign Up Link */}
            <p className="text-center text-zinc-400 text-sm sm:text-base">
              Don&apos;t have an account?{" "}
              <Link
                to={"/register"}
                className="font-semibold hover:underline hover:opacity-80 transition-opacity"
                style={{ color: "#F84565" }}
                // You might consider disabling this if `isLoading` true, depending on desired UX
              >
                Sign up
              </Link>
            </p>
          </form>
          <div className="flex items-center gap-4 mt-4">
            <div className="flex-1 h-px bg-zinc-700"></div>
            <span className="text-xs sm:text-sm text-zinc-500 font-medium whitespace-nowrap">
              Or
            </span>
            <div className="flex-1 h-px bg-zinc-700"></div>
          </div>
          <div className="flex justify-center mt-4">
            <GoogleLoginComponent isLoading={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
