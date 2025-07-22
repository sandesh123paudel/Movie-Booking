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
import EmailVerification from "./pages/auth/Email-Verify";
import ForgetPassword from "./pages/auth/ForgetPassword";
import ErrorPage from "./pages/404-Page";
import { Toaster } from "react-hot-toast";

const App = () => {
  const location = useLocation();

  // Define paths where Navbar and Footer should NOT be shown
  const noNavFooterPaths = ["/404"];

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
            background: "#ffffff",
            color: "#b70808",
          },
        }}
      />

      {/* Conditionally render Navbar */}
      {!hideNavFooter && <Navbar />}

      <Routes>
        {/* Your app routes */}
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/movies/:id" element={<MovieDetails />} />
        <Route path="/movie/:id/:date" element={<SeatLayout />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/favorite" element={<Favorite />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/email-verify" element={<EmailVerification />} />
        <Route path="/reset-password" element={<ForgetPassword />} />

        {/* Dedicated 404 page */}
        <Route path="/404" element={<ErrorPage />} />

        {/* Redirect all unknown routes to /404 */}
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>

      {/* Conditionally render Footer */}
      {!hideNavFooter && <Footer />}
    </>
  );
};

export default App;
