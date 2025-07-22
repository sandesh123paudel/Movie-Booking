import axios from "axios";
import { createContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

export const AppContent = createContext();

export const AppContextProvider = (props) => {
  axios.defaults.withCredentials = true;

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  console.log("Value of VITE_BACKEND_URL in AppContext:", backendUrl);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null); // Initialize userData to null

  const getUserData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/data");
      if (data.success) {
        setUserData(data.userData);
        setIsLoggedIn(true); // Crucial: Set isLoggedIn to true on successful data fetch
      } else {
        setUserData(null); // Clear user data on failure
        setIsLoggedIn(false); // Crucial: Set isLoggedIn to false on failure
        // toast.error(data.message); // Optionally show error, but might be redundant with getAuthState
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setUserData(null); // Clear user data on error
      setIsLoggedIn(false); // Crucial: Set isLoggedIn to false on error
      // toast.error(error.message); // Optionally show error
    }
  };

  const getAuthState = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/auth/is-auth");
      if (data.success) {
        setIsLoggedIn(true);
        // Only fetch user data if successfully authenticated
        // This prevents unnecessary calls if already logged in and data is fresh
        if (!userData || userData.email !== data.user?.email) {
          // Simple check to avoid re-fetching if data is likely current
          getUserData();
        }
      } else {
        setIsLoggedIn(false);
        setUserData(null); // Ensure userData is cleared if not authenticated
      }
    } catch (error) {
      console.error("Error getting auth state:", error);
      setIsLoggedIn(false);
      setUserData(null); // Ensure userData is cleared on auth state error
      // toast.error(error.message); // Optionally show error
    }
  };

  useEffect(() => {
    getAuthState();
  }, []); // Run once on component mount to check initial auth state

  const value = {
    backendUrl,
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData,
    getUserData,
  };
  return (
    <AppContent.Provider value={value}>{props.children}</AppContent.Provider>
  );
};
