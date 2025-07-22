import React, { useContext, useState, useRef, useEffect } from "react";
import { assets } from "../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { MenuIcon, SearchIcon, XIcon, User, ChevronDown } from "lucide-react"; // Removed XCircleIcon as it's not used in the provided code
import { AppContent } from "../context/AppContext";
import toast from "react-hot-toast";
import axios from "axios";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false); // State for search overlay
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const profileDropdownRef = useRef(null);
  const { userData, backendUrl, setUserData, setIsLoggedIn } =
    useContext(AppContent);

  // Close dropdown and search overlay when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setIsProfileDropdownOpen(false);
      }
    };

    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setIsSearchOpen(false); // Close search on Escape
        setIsOpen(false); // Close mobile menu on Escape
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendUrl + "/api/auth/logout");
      data.success && setIsLoggedIn(false);
      data.success && setUserData(false);
      toast.success(data.message);
      setIsProfileDropdownOpen(false);
      navigate("/");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleProfileNavigation = (path) => {
    navigate(path);
    setIsProfileDropdownOpen(false);
  };

  return (
    <>
      <div className="fixed top-0 left-0 z-50 w-full flex justify-between items-center px-6 md:px-16 lg:px-36 py-5 text-white">
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
            className="md:hidden absolute top-6 right-6 w-6 h-6 cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
          />
          <Link
            onClick={() => {
              window.scrollTo(0, 0);
              setIsOpen(false);
            }}
            to="/"
          >
            Home
          </Link>
          <Link
            onClick={() => {
              window.scrollTo(0, 0);
              setIsOpen(false);
            }}
            to="/movies"
          >
            Movies
          </Link>
          <Link
            onClick={() => {
              window.scrollTo(0, 0);
              setIsOpen(false);
            }}
            to="/theaters"
          >
            Theaters
          </Link>
          <Link
            onClick={() => {
              window.scrollTo(0, 0);
              setIsOpen(false);
            }}
            to="/favorite"
          >
            Favorite
          </Link>
        </div>

        {userData ? (
          <div className="flex items-center gap-8">
            <SearchIcon
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className=" w-6 h-6 cursor-pointer"
            />

            {/* Profile Dropdown */}
            <div className="relative" ref={profileDropdownRef}>
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-2 px-4 py-1 sm:px-7 sm:py-2 bg-primary hover:bg-primary-dull transition font-medium rounded-full cursor-pointer"
              >
                <User className="w-5 h-5" />
                <span className="max-sm:hidden">
                  {userData?.fullName?.split(" ")[0]}
                </span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isProfileDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 ">
                  <div className=" sm:hidden w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors text-gray-800 cursor-pointer">
                    {userData?.fullName}
                  </div>
                  <button
                    onClick={() => handleProfileNavigation("/my-bookings")}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors text-gray-800 cursor-pointer"
                  >
                    My Bookings
                  </button>
                  <button
                    onClick={() => handleProfileNavigation("/profile")}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors text-gray-800 cursor-pointer"
                  >
                    User Details
                  </button>
                  <hr className="my-1 border-gray-200" />
                  <button
                    onClick={logout}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors text-red-600 cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-8">
            <SearchIcon
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className=" w-6 h-6 cursor-pointer"
            />

            <button
              onClick={() => {
                navigate("/login");
                window.scrollTo(0, 0);
              }}
              className="px-4 py-1 sm:px-7 sm:py-2 bg-primary  hover:bg-primary-dull transition font-medium rounded-full cursor-pointer"
            >
              Login
            </button>
          </div>
        )}

        {/* For Mobile Device */}
        <MenuIcon
          className="max-md:ml-4 md:hidden w-8 h-8 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        ></MenuIcon>
      </div>

      {/* --- Search Overlay (Corrected Animation) --- */}
      <div
        className={`
          fixed inset-0 z-[100] flex flex-col items-center justify-center
          bg-black/70 backdrop-blur-md
          transition-all duration-500 ease-in-out
          ${
            isSearchOpen
              ? "translate-y-0 opacity-100 pointer-events-auto"
              : "-translate-y-full opacity-0 pointer-events-none"
          }
        `}
      >
        {/* Close Button in Top Right */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 md:top-8 md:right-8">
          <XIcon
            className="w-8 h-8 sm:w-10 sm:h-10 cursor-pointer text-white"
            onClick={() => setIsSearchOpen(false)}
          />
        </div>
        {/* End Close Button */}

        <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl relative mx-4">
          <input
            type="text"
            placeholder="Search movies, theaters..."
            className="w-full p-4 pl-12 pr-12 rounded-full bg-white bg-opacity-90 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary text-lg"
          />

          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-6 h-6" />
        </div>

        {/* Search Button */}
        <button
          className="mt-6 px-8 py-3 bg-primary text-white rounded-full text-lg font-semibold shadow-lg hover:bg-primary-dark transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-light focus:ring-opacity-75 cursor-pointer"
          onClick={() => {
            console.log("Search button clicked!");
            // Add your search logic here
            // setIsSearchOpen(false); // Optionally close after search
          }}
        >
          Search
        </button>
      </div>
    </>
  );
};

export default Navbar;
