import React, { useState, useRef, useEffect } from "react";
import { assets } from "../assets/assets"; // Assuming this path is correct
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import { MenuIcon, SearchIcon, XIcon, UserIcon } from "lucide-react"; // UserIcon might be useful, but not directly used in the current profile circle
import { useAuth } from "../hooks/AuthContext"; // Ensure this path is correct
import toast from "react-hot-toast";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false); // State for mobile menu
  const [isProfileOpen, setIsProfileOpen] = useState(false); // State for desktop profile dropdown
  const { user, isAuthenticated, logout } = useAuth(); // Destructure user, isAuthenticated, and logout
  const navigate = useNavigate(); // Initialize useNavigate hook for redirection
  const profileRef = useRef(null); // Ref for clicking outside the profile dropdown

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged Out Successfully!");
      setIsProfileOpen(false); // Close profile dropdown
      setIsOpen(false); // Close mobile menu (if open)
      navigate("/login"); // Redirect to login page
    } catch (error) {
      toast.error("Logout Failed. Please try again.");
      console.error("Logout error:", error);
    }
  };

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // If profile dropdown is open AND the click is outside the profile dropdown area
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    // Add event listener on mount
    document.addEventListener("mousedown", handleClickOutside);
    // Cleanup event listener on unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []); // Empty dependency array means this runs once on mount and cleans up on unmount

  // Get user initials for profile circle
  const getUserInitials = () => {
    if (user?.fullName) {
      // Takes first letter of each word in full name
      return user.fullName
        .split(" ")
        .map((name) => name[0])
        .join("")
        .toUpperCase();
    } else if (user?.email) {
      // Takes first letter of email if full name is not available
      return user.email[0].toUpperCase();
    }
    return "U"; // Default initial if no user info
  };

  const handleLinkClick = () => {
    window.scrollTo(0, 0); // Scroll to top
    setIsOpen(false); // Close mobile menu
    setIsProfileOpen(false); // Close profile dropdown (important for desktop)
  };

  return (
    <div className="fixed top-0 left-0 z-50 w-full flex justify-between items-center px-6 md:px-16 lg:px-36 py-5 bg-black/70 backdrop-blur-sm">
      {" "}
      {/* Added background for fixed navbar */}
      <Link to="/" className="max-md:flex-1">
        <img
          src={assets.logo}
          alt="Moovie Booking- Logo"
          className="w-36 h-auto"
        />
      </Link>
      {/* Main Navigation Links (for both desktop and mobile) */}
      <div
        className={`max-md:absolute max-md:top-0 max-md:left-0 max-md:font-medium max-md:text-lg z-50 flex flex-col md:flex-row items-center max-md:justify-center gap-8 min-md:px-8 py-3 max-md:h-screen min-md:rounded-full backdrop-blur bg-black/70 md:bg-white/10 md:border border-gray-300/20 overflow-hidden transition-[width] duration-300 ${
          isOpen ? "max-md:w-full" : "max-md:w-0"
        } `}
      >
        {/* Close button for mobile menu */}
        <XIcon
          className="md:hidden absolute top-6 right-6 w-6 h-6 cursor-pointer text-white"
          onClick={() => setIsOpen(false)} // Directly set to false
        />

        {/* Navigation Links */}
        <Link
          onClick={handleLinkClick}
          to="/"
          className="text-white md:text-inherit"
        >
          Home
        </Link>
        <Link
          onClick={handleLinkClick}
          to="/movies"
          className="text-white md:text-inherit"
        >
          Movies
        </Link>
        <Link
          onClick={handleLinkClick}
          to="/theaters"
          className="text-white md:text-inherit"
        >
          Theaters
        </Link>
        <Link
          onClick={handleLinkClick}
          to="/favorite"
          className="text-white md:text-inherit"
        >
          Favorite
        </Link>

        {/* Conditional Link for Verified vs. Unverified Users in mobile menu only, desktop uses profile dropdown */}
        {isAuthenticated && (
          <>
            {user?.isEmailVerified ? (
              <Link
                onClick={handleLinkClick}
                to="/my-bookings"
                className="md:hidden text-white"
              >
                My Bookings
              </Link>
            ) : (
              <Link
                onClick={handleLinkClick}
                to="/verify-email"
                className="md:hidden text-yellow-400 font-semibold"
              >
                Verify Email
              </Link>
            )}
          </>
        )}

        {/* Mobile menu specific auth buttons (Login/Register/Logout) */}
        <div className="md:hidden flex flex-col items-center gap-4 mt-8">
          {isAuthenticated ? (
            <>
              <span className="text-white text-base font-semibold text-center">
                Welcome, {user?.fullName || user?.email}!
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-primary hover:bg-primary-dull transition font-medium rounded-full cursor-pointer text-white w-fit"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={handleLinkClick}
                className="text-white px-4 py-2 bg-primary hover:bg-primary-dull transition font-medium rounded-full cursor-pointer w-fit"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={handleLinkClick}
                className="text-white px-4 py-2 bg-primary hover:bg-primary-dull transition font-medium rounded-full cursor-pointer w-fit"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
      {/* Right side of Navbar (Search, Profile/Login button) */}
      <div className="flex items-center gap-8">
        <SearchIcon className="max-md:hidden w-6 h-6 cursor-pointer text-white" />

        {isAuthenticated ? (
          <div className="relative" ref={profileRef}>
            {/* Profile Circle */}
            <div
              className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold cursor-pointer hover:bg-primary-dull transition"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              {getUserInitials()}
            </div>

            {/* Dropdown Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 top-12 bg-zinc-800 rounded-lg shadow-lg border border-zinc-700 py-2 min-w-48 z-50 overflow-hidden">
                <p className="px-4 py-2 text-zinc-300 text-sm border-b border-zinc-700">
                  Welcome,{" "}
                  <span className="font-semibold text-white">
                    {user?.fullName || user?.email.split("@")[0]}
                  </span>
                </p>
                {user?.isEmailVerified ? (
                  <>
                    <Link
                      to="/my-bookings"
                      onClick={handleLinkClick}
                      className="block px-4 py-2 text-white hover:bg-zinc-700 transition duration-200"
                    >
                      My Bookings
                    </Link>
                    <Link
                      to="/profile"
                      onClick={handleLinkClick}
                      className="block px-4 py-2 text-white hover:bg-zinc-700 transition duration-200"
                    >
                      Profile Settings
                    </Link>
                  </>
                ) : (
                  <Link
                    to="/verify-email"
                    onClick={handleLinkClick}
                    className="block px-4 py-2 text-yellow-400 hover:bg-zinc-700 transition duration-200 font-semibold"
                  >
                    Verify Email
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-red-500 hover:bg-zinc-700 transition duration-200 border-t border-zinc-700"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login">
            <button className="px-4 py-1 sm:px-7 sm:py-2 bg-primary hover:bg-primary-dull transition font-medium rounded-full cursor-pointer text-white">
              Login
            </button>
          </Link>
        )}
      </div>
      {/* Mobile Menu Icon */}
      <MenuIcon
        className="max-md:ml-4 md:hidden w-8 h-8 cursor-pointer text-white"
        onClick={() => setIsOpen(true)} // Open mobile menu
      />
    </div>
  );
};

export default Navbar;
