import React, { useState } from "react";
import { assets } from "../../assets/assets"; // Assuming this path is correct
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/AuthContext"; // Adjust path as needed
import { registerUser } from "../../api"; // Ensure this path is correct for your api.js
import toast from "react-hot-toast"; // Import toast for notifications

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "", // Corrected to match your api.js function signature
    email: "",
    password: "",
    agreeTerms: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { register } = useAuth(); // Destructure the register function from AuthContext
  const navigate = useNavigate();

  const handleInput = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    setLoading(true); // Set loading state

    // Basic client-side validation
    if (!formData.agreeTerms) {
      setError("You must agree to the Terms of Service and Privacy Policy.");
      setLoading(false);
      return;
    }

    try {
      // Call registerUser from your API, passing all required formData fields
      const response = await registerUser(
        formData.fullName, // Pass fullName
        formData.email,
        formData.password
      );

      // Assuming your backend responds with a 'success' boolean and 'message'
      // And also includes user data and token if registration implies immediate login
      if (response.success) {
        register(response); // Use the register function from AuthContext to update state and localStorage
        toast.success(
          response.message ||
            "Registration successful! Please verify your email."
        );
        navigate("/verify-email"); // Navigate to the verify email page
      } else {
        // If backend indicates failure but no error was thrown
        throw new Error(response.message || "Registration failed.");
      }
    } catch (err) {
      // Catch errors from the API call or custom errors thrown above
      const errorMessage =
        err.message || "An unexpected error occurred during registration.";
      setError(errorMessage);
    } finally {
      setLoading(false); // Always reset loading state
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center mt-16">
      <div className="w-full max-w-xl">
        {/* Register Form */}
        <div className="rounded-2xl shadow-2xl p-6 sm:p-8 ">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Create Account
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base">
              Join us and start booking your favorite movies
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            {" "}
            {/* Wrap content in a form and bind onSubmit */}
            {/* Google Sign Up Button (Placeholder, no functionality added here) */}
            <button
              type="button" // Important: set type="button" to prevent form submission
              className="w-full flex items-center justify-center gap-3 h-12 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-xl transition-all duration-200 hover:shadow-lg"
              disabled={loading} // Disable if loading
            >
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
                Or sign up with email
              </span>
              <div className="flex-1 h-px bg-zinc-700"></div>
            </div>
            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}
            {/* Full Name Input */}
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
                  />
                </svg>
              </div>
              <input
                type="text"
                name="fullName" // Corrected name to match formData state and api.js
                value={formData.fullName} // Bind value
                onChange={handleInput}
                placeholder="Enter your full name"
                className="w-full h-12 pl-12 pr-4 bg-zinc-800 border border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 text-sm sm:text-base text-white placeholder-zinc-400"
                style={{ "--tw-ring-color": "#F84565" }}
                required
                disabled={loading}
              />
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
                value={formData.email} // Bind value
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
                value={formData.password} // Bind value
                onChange={handleInput}
                placeholder="Create a password"
                className="w-full h-12 pl-12 pr-4 bg-zinc-800 border border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 text-sm sm:text-base text-white placeholder-zinc-400"
                style={{ "--tw-ring-color": "#F84565" }}
                required
                disabled={loading}
              />
            </div>
            {/* Terms and Conditions */}
            <div className="flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms} // Bind checked state
                onChange={handleInput}
                className="w-4 h-4 mt-0.5 border-zinc-600 rounded focus:ring-2 bg-zinc-800 checked:bg-red-500 checked:border-red-500"
                style={{
                  "--tw-ring-color": "#F84565",
                  accentColor: "#F84565",
                }}
                required
                disabled={loading}
              />
              <label className="text-zinc-300 leading-5">
                I agree to the{" "}
                <button
                  type="button"
                  className="font-medium hover:underline hover:opacity-80 transition-opacity"
                  style={{ color: "#F84565" }}
                >
                  Terms of Service
                </button>{" "}
                and{" "}
                <button
                  type="button"
                  className="font-medium hover:underline hover:opacity-80 transition-opacity"
                  style={{ color: "#F84565" }}
                >
                  Privacy Policy
                </button>
              </label>
            </div>
            {/* Submit Button */}
            <button
              type="submit" // Set type to submit for form submission
              className="w-full h-12 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] hover:opacity-90 cursor-pointer"
              style={{
                backgroundColor: "#F84565",
                backgroundImage:
                  "linear-gradient(135deg, #F84565 0%, #D63854 100%)",
              }}
              disabled={loading} // Disable button while loading
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
            {/* Sign In Link */}
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
          </form>{" "}
          {/* Close the form tag */}
        </div>
      </div>
    </div>
  );
};

export default Register;
