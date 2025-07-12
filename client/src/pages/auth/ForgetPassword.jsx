import React, { useState } from "react";
import { assets } from "../../assets/assets";
import { Link } from "react-router-dom";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-zinc-900 rounded-2xl shadow-2xl p-6 sm:p-8 border border-zinc-800">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Forgot Password?
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base">
              Enter your email and we’ll send you a reset link.
            </p>
          </div>

          <div className="space-y-6">
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full h-12 pl-12 pr-4 bg-zinc-800 border border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 text-sm sm:text-base text-white placeholder-zinc-400"
                style={{ "--tw-ring-color": "#F84565" }}
                required
              />
            </div>

            {/* Submit Button */}
            <button
              className="w-full h-12 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] hover:opacity-90"
              style={{
                backgroundColor: "#F84565",
                backgroundImage:
                  "linear-gradient(135deg, #F84565 0%, #D63854 100%)",
              }}
            >
              Send Reset Link
            </button>

            {/* Back to Login */}
            <p className="text-center text-zinc-400 text-sm sm:text-base">
              Remember your password?{" "}
              <Link
                to="/auth/login"
                className="font-semibold hover:underline hover:opacity-80 transition-opacity"
                style={{ color: "#F84565" }}
              >
                Back to Sign In
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col items-center mt-4 text-zinc-500 text-xs sm:text-sm">
          <img
            src={assets.logo}
            alt="Moovie Booking - Logo"
            className="w-36 h-auto mb-3 justify-center"
          />
          <p>
            © {new Date().getFullYear()} Movie Booking. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
