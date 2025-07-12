import React, { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleInput = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // This is a placeholder for your actual login logic.
  // In a real application, this function would likely make an API call
  // to your backend for authentication.
  const loginUser = async (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === "test@example.com" && password === "password123") {
          resolve("Successfully logged in!");
        } else {
          reject(new Error("Invalid email or password."));
        }
      }, 2000); // Simulate a 2-second API call
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { email, password } = formData; // Destructure email and password from formData

    toast.promise(loginUser(email, password), {
      loading: "Logging in...",
      success: <b>Logged In!</b>,

      error: (err) => <b>{err.message}</b>, // Display the error message from the rejected promise
    });
  };

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

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Google Sign In Button */}
            <button className="w-full flex items-center justify-center gap-3 h-12 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-xl transition-all duration-200 hover:shadow-lg">
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
                Continue with Google
              </span>
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-zinc-700"></div>
              <span className="text-xs sm:text-sm text-zinc-500 font-medium whitespace-nowrap">
                Or continue with email
              </span>
              <div className="flex-1 h-px bg-zinc-700"></div>
            </div>

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
                value={formData.email}
                onChange={handleInput}
                placeholder="Enter your email"
                className="w-full h-12 pl-12 pr-4 bg-zinc-800 border border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 text-sm sm:text-base text-white placeholder-zinc-400"
                style={{ "--tw-ring-color": "#F84565" }}
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
                value={formData.password}
                onChange={handleInput}
                required
                placeholder="Enter your password"
                className="w-full h-12 pl-12 pr-4 bg-zinc-800 border border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 text-sm sm:text-base text-white placeholder-zinc-400"
                style={{ "--tw-ring-color": "#F84565" }}
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInput}
                  className="w-4 h-4 border-zinc-600 rounded focus:ring-2 bg-zinc-800 checked:bg-red-500 checked:border-red-500"
                  style={{
                    "--tw-ring-color": "#F84565",
                    accentColor: "#F84565",
                  }}
                />
                <span className="text-zinc-300">Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-red-400 hover:text-red-300 font-medium hover:underline"
                style={{ color: "#F84565" }}
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
            >
              Sign In
            </button>

            {/* Sign Up Link */}
            <p className="text-center text-zinc-400 text-sm sm:text-base">
              Don&apos;t have an account?{" "}
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
