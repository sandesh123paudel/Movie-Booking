import React from "react";
import Navbar from "./components/Navbar";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Movies from "./pages/Movies";
import MovieDetails from "./pages/MovieDetails";
import SeatLayout from "./pages/SeatLayout";
import MyBookings from "./pages/MyBookings";
import Favorite from "./pages/Favorite";
import { Toaster } from "react-hot-toast";
import Footer from "./components/Footer";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import ForgetPassword from "./pages/auth/ForgetPassword";

const App = () => {
  const isAdminRoute = useLocation().pathname.startsWith("/admin");
  const isAuthRoute = useLocation().pathname.startsWith("/auth");

  return (
    <>
      <Toaster />
      {!isAdminRoute && !isAuthRoute && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/movies" element={<Movies />}></Route>
        <Route path="/movies/:id" element={<MovieDetails />}></Route>
        <Route path="/movie/:id/:date" element={<SeatLayout />}></Route>
        <Route path="/my-bookings" element={<MyBookings />}></Route>
        <Route path="/favorite" element={<Favorite />}></Route>
        <Route path="/auth/login" element={<Login />}></Route>
        <Route path="/auth/register" element={<Register />}></Route>
        <Route path="/auth/forgot-password" element={<ForgetPassword />} />
      </Routes>
      {!isAdminRoute && !isAuthRoute && <Footer />}
    </>
  );
};

export default App;
