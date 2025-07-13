import React, { useState, useRef, useEffect } from "react";
import { assets } from "../assets/assets"; // Assuming this path is correct
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import { MenuIcon, SearchIcon, XIcon, UserIcon } from "lucide-react";
import { useAuth } from "../hooks/AuthContext"; // Ensure this path is correct

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth(); // Destructure user, isAuthenticated, and logout
  const navigate = useNavigate(); // Initialize useNavigate hook for redirection
  const profileRef = useRef(null);

  const handleLogout = () => {
    logout(); // Call the logout function from AuthContext
    setIsOpen(false); // Close the mobile menu after logging out
    setIsProfileOpen(false); // Close the profile dropdown
    navigate("/login"); // Redirect to the login page after logout
  };

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Get user initials for profile circle
  const getUserInitials = () => {
    if (user?.fullName) {
      return user.fullName
        .split(" ")
        .map((name) => name[0])
        .join("")
        .toUpperCase();
    } else if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return "U";
  };

  return (
    <div className="fixed top-0 left-0 z-50 w-full flex justify-between items-center px-6 md:px-16 lg:px-36 py-5">
      <Link to="/" className="max-md:flex-1">
        <img
          src={assets.logo}
          alt="Moovie Booking- Logo"
          className="w-36 h-auto"
        />
      </Link>
      <div
        className={`max-md:absolute max-md:top-0 max-md:left-0 max-md:font-medium max-md:text-lg z-50 flex flex-col md:flex-row items-center max-md:justify-center gap-8 min-md:px-8 py-3 max-md:h-screen min-md:rounded-full backdrop-blur bg-black/70 md:bg-white/10 md:border border-gray-300/20 overflow-hidden transition-[width] duration-300 ${
          isOpen ? "max-md:w-full" : "max-md:w-0"
        } `}
      >
        <XIcon
          className="md:hidden absolute top-6 right-6 w-6 h-6 cursor-pointer text-white" // Added text-white for visibility
          onClick={() => setIsOpen(!isOpen)}
        />
        <Link
          onClick={() => {
            window.scrollTo(0, 0); // Corrected to window.scrollTo
            setIsOpen(false);
          }}
          to="/"
          className="text-white md:text-inherit" // Ensure text color is consistent
        >
          Home
        </Link>
        <Link
          onClick={() => {
            window.scrollTo(0, 0);
            setIsOpen(false);
          }}
          to="/movies"
          className="text-white md:text-inherit"
        >
          Movies
        </Link>
        <Link
          onClick={() => {
            window.scrollTo(0, 0);
            setIsOpen(false);
          }}
          to="/theaters"
          className="text-white md:text-inherit"
        >
          Theaters
        </Link>
        <Link
          onClick={() => {
            window.scrollTo(0, 0);
            setIsOpen(false);
          }}
          to="/favorite"
          className="text-white md:text-inherit"
        >
          Favorite
        </Link>

        {/* --- Display user or login/register based on authentication status (Mobile Menu) --- */}
        <div className="md:hidden flex flex-col items-center gap-4 mt-8">
          {isAuthenticated ? (
            <>
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {getUserInitials()}
                </div>
                <span className="text-white text-base font-semibold text-center">
                  {user?.fullName || user?.email}
                </span>
              </div>
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
                onClick={() => setIsOpen(false)}
                className="text-white px-4 py-2 bg-primary hover:bg-primary-dull transition font-medium rounded-full cursor-pointer w-fit"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setIsOpen(false)}
                className="text-white px-4 py-2 bg-primary hover:bg-primary-dull transition font-medium rounded-full cursor-pointer w-fit"
              >
                Register
              </Link>
            </>
          )}
        </div>
        {/* --------------------------------------------------------------------------------- */}
      </div>
      <div className="flex items-center gap-8">
        <SearchIcon className="max-md:hidden w-6 h-6 cursor-pointer text-white" />
        {/* --- Conditional rendering for desktop view --- */}
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
              <div className="absolute right-0 top-12 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-48 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.fullName || user?.email}
                  </p>
                  {user?.email && user?.fullName && (
                    <p className="text-xs text-gray-500">{user.email}</p>
                  )}
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
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
        {/* ------------------------------------------- */}
      </div>

      {/* For Mobile Device */}
      <MenuIcon
        className="max-md:ml-4 md:hidden w-8 h-8 cursor-pointer text-white"
        onClick={() => setIsOpen(!isOpen)}
      />
    </div>
  );
};

export default Navbar;
