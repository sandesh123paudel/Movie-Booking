import React, { useEffect, useState } from "react";
import { assets } from "../assets/assets";

const Preloader = () => {
  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-black transition-all duration-700 
        "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Logo with subtle glow */}
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-primary opacity-20 blur-lg rounded-full scale-125"></div>
        <img
          src={assets.logo}
          alt="Logo"
          className="relative w-24 h-24 animate-bounce"
        />
      </div>
    </div>
  );
};

export default Preloader;
