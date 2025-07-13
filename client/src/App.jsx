// App.jsx
import React from "react";
import { Route, Routes, useLocation, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Movies from "./pages/Movies";
import MovieDetails from "./pages/MovieDetails";
import SeatLayout from "./pages/SeatLayout";
import MyBookings from "./pages/MyBookings";
import Favorite from "./pages/Favorite";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import ForgetPassword from "./pages/auth/ForgetPassword";
import VerifyEmail from "./pages/auth/VerifyEmail"; // Import your new component
import ErrorPage from "./pages/404-Page";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./hooks/AuthContext";
import PublicRoute from "./components/PublicRoute";

const App = () => {
  const location = useLocation();

  // Define paths where Navbar and Footer should NOT be shown
  const noNavFooterPaths = ["/404", "/verify-email"]; // Added /verify-email for fullscreen experience

  // Determine if current path is in the noNavFooterPaths list or starts with /verify-email
  const hideNavFooter =
    noNavFooterPaths.includes(location.pathname) ||
    location.pathname.startsWith("/verify-email");

  return (
    <>
      <Toaster
        position="bottom-left"
        reverseOrder={true}
        toastOptions={{
          duration: 4000,
          style: {
            background: "#F84565",
            color: "#fff",
          },
        }}
      />

      <AuthProvider>
        {!hideNavFooter && <Navbar />}

        <Routes>
          {/* Public routes that everyone can access */}
          <Route path="/" element={<Home />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/movies/:id" element={<MovieDetails />} />
          {/* Add more general public routes here */}

          {/* Routes accessible only if NOT logged in (Login, Register, Forgot Password) */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgetPassword />} />
          </Route>

          {/* Email verification route - accessible to everyone */}
          <Route path="/verify-email/:token" element={<VerifyEmail />} />

          {/* Routes accessible only if logged in AND VERIFIED */}
          {/* You might want a general ProtectedRoute for these too later */}
          <Route path="/movie/:id/:date" element={<SeatLayout />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/favorite" element={<Favorite />} />

          {/* Dedicated 404 page */}
          <Route path="/404" element={<ErrorPage />} />

          {/* Redirect all unknown routes to /404 */}
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>

        {!hideNavFooter && <Footer />}
      </AuthProvider>
    </>
  );
};

export default App;
