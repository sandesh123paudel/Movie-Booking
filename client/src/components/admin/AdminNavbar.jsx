import React from "react";
import { Link } from "react-router-dom";
import { assets } from "../../assets/assets";

const AdminNavbar = () => {
  return (
    <div className="flex  items-center justify-between px-6 md:px-10 h-16 border-b border-gray-300/30">
      <Link to={"/admin"}>
        <img src={assets.logo} alt="logo" className="w-36 h-auto" />
      </Link>
      <button className=" px-4 py-2 text-left bg-primary hover:bg-primary-dull transition-colors text-white cursor-pointer rounded-full">
        Logout
      </button>
    </div>
  );
};

export default AdminNavbar;
