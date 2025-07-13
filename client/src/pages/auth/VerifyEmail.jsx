// src/pages/auth/VerifyEmail.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { verifyEmail } from "../../api";
import toast from "react-hot-toast";

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying"); // 'verifying', 'success', 'error'
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleEmailVerification = async () => {
      if (!token) {
        setStatus("error");
        setMessage("Invalid verification link. No token provided.");
        setLoading(false);
        return;
      }

      try {
        console.log("Verifying email with token:", token);
        const response = await verifyEmail(token);

        if (response.success) {
          setStatus("success");
          setMessage(response.message || "Email verified successfully!");
          toast.success("Email verified successfully!");

          // Redirect to login page after 3 seconds
          setTimeout(() => {
            navigate("/login");
          }, 3000);
        } else {
          throw new Error(response.message || "Email verification failed");
        }
      } catch (error) {
        console.error("Email verification error:", error);
        setStatus("error");
        setMessage(
          error.message || "Email verification failed. Please try again."
        );
        toast.error(error.message || "Email verification failed");
      } finally {
        setLoading(false);
      }
    };

    handleEmailVerification();
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-zinc-900 rounded-2xl shadow-2xl p-8 text-center">
          {loading ? (
            // Loading State
            <div className="space-y-4">
              <div
                className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto"
                style={{ borderColor: "#F84565" }}
              ></div>
              <h2 className="text-2xl font-bold text-white">
                Verifying Email...
              </h2>
              <p className="text-zinc-400">
                Please wait while we verify your email address.
              </p>
            </div>
          ) : status === "success" ? (
            // Success State
            <div className="space-y-4">
              <div className="mx-auto w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white">Email Verified!</h2>
              <p className="text-zinc-400">{message}</p>
              <p className="text-zinc-500 text-sm">
                Redirecting to login page in 3 seconds...
              </p>
              <div className="space-y-3 pt-4">
                <button
                  onClick={() => navigate("/login")}
                  className="w-full h-12 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] hover:opacity-90"
                  style={{
                    backgroundColor: "#F84565",
                    backgroundImage:
                      "linear-gradient(135deg, #F84565 0%, #D63854 100%)",
                  }}
                >
                  Go to Login
                </button>
                <Link
                  to="/"
                  className="block w-full h-12 bg-zinc-700 hover:bg-zinc-600 text-zinc-200 font-semibold rounded-xl transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center"
                >
                  Go to Home
                </Link>
              </div>
            </div>
          ) : (
            // Error State
            <div className="space-y-4">
              <div className="mx-auto w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white">
                Verification Failed
              </h2>
              <p className="text-zinc-400">{message}</p>
              <div className="space-y-3 pt-4">
                <Link
                  to="/login"
                  className="block w-full h-12 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] hover:opacity-90 flex items-center justify-center"
                  style={{
                    backgroundColor: "#F84565",
                    backgroundImage:
                      "linear-gradient(135deg, #F84565 0%, #D63854 100%)",
                  }}
                >
                  Back to Login
                </Link>
                <Link
                  to="/register"
                  className="block w-full h-12 bg-zinc-700 hover:bg-zinc-600 text-zinc-200 font-semibold rounded-xl transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center"
                >
                  Create New Account
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
