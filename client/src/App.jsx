import React, { useEffect, useState } from "react";
import { Route, Routes, useLocation, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Toaster } from "react-hot-toast";
import Preloader from "./components/Preloader";

// Pages
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

// Admin Pages
import Layout from "./pages/admin/Layout";
import Dashboard from "./pages/admin/Dashboard";
import AddShows from "./pages/admin/AddShows";
import ListShows from "./pages/admin/ListShows";
import ListBookings from "./pages/admin/ListBookings";

const App = () => {
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const lastVisit = localStorage.getItem("lastVisit");
    const now = Date.now();

    if (!lastVisit || now - parseInt(lastVisit) > 24 * 60 * 60 * 1000) {
      // First visit or after 24 hours
      setLoading(true);
      localStorage.setItem("lastVisit", now.toString());

      const timeout = setTimeout(() => {
        setLoading(false);
      }, 3000); // Show preloader for 3s

      return () => clearTimeout(timeout);
    } else {
      setLoading(false);
    }
  }, []);

  const hiddenPaths = ["/404", "/verify-email", "/admin"];
  const hideNavFooter = hiddenPaths.some((path) =>
    location.pathname.startsWith(path)
  );

  if (loading) return <Preloader />;

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

      {!hideNavFooter && <Navbar />}

      <Routes>
        {/* Public Routes */}
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
        <Route path="/404" element={<ErrorPage />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="add-shows" element={<AddShows />} />
          <Route path="list-shows" element={<ListShows />} />
          <Route path="list-bookings" element={<ListBookings />} />
        </Route>

        {/* 404 fallback */}
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>

      {!hideNavFooter && <Footer />}
    </>
  );
};

export default App;
