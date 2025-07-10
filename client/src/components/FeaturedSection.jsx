import { ArrowRight } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import BlurCircle from "./BlurCircle";
import { assets } from "../assets/assets";

const FeaturedSection = () => {
  const navigate = useNavigate();
  return (
    <div className="px-6 md:px-16 lg:px-36 xl:px-44 overflow-hidden">
      <div className="relative flex justify-between pt-20 pb-10">
        <BlurCircle top="0" right="-80px" />
        <p>Now Showing</p>
        <button
          onClick={() => navigate("/movies")}
          className="group flex items-center  text-sm text-gray-300 gap-2 cursor-pointer "
        >
          View All
          <ArrowRight className="group-hover:translate-x-0.5 transition w-4.5 h-4.5" />
        </button>
      </div>

      <div className=""></div>

      <div className="flex justify-center mt-20 mb-10">
        <button
          onClick={() => {
            navigate("/movies");
            scrollTo(0, 0);
          }}
          className="bg-primary rounded-full px-4 py-2 cursor-pointer hover:bg-primary-dull transition-all duration-300"
        >
          <p>Show more</p>
        </button>
      </div>
    </div>
  );
};

export default FeaturedSection;
