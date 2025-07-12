import React from "react";
import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="flex flex-col items-center justify-center max-w-lg text-center py-20rounded-lg shadow-lg">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-gray-500 bg-clip-text text-transparent">
          404 Not Found
        </h1>
        <div className="h-px w-80 rounded bg-gradient-to-r from-gray-400 to-gray-800 my-7"></div>
        <p className="text-xl text-gray-600 max-w-md">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          to="/"
          className="group flex items-center gap-1 bg-primary hover:bg-primary-dull px-7 py-2.5 text-white rounded-full mt-10 font-medium active:scale-95 transition-all"
        >
          Back to Home
          <svg
            className="group-hover:translate-x-0.5 transition-transform"
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4.583 11h12.833m0 0L11 4.584M17.416 11 11 17.417"
              stroke="#ffffff"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
