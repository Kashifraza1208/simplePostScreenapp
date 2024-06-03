import React from "react";
import { Link } from "react-router-dom";
import { MdErrorOutline } from "react-icons/md"; // Importing the icon from react-icons

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-[#fff5bc] to-[#cec1ff] flex items-center justify-center p-8 box-border">
      <div className="bg-white h-full w-1/2 rounded-3xl p-8 flex flex-col items-center justify-center">
        <MdErrorOutline className="text-5xl mb-8" />
        <h2 className="text-4xl py-8">Page Not Found</h2>
        <Link to="/">
          <h5 className="text-xl text-gray-700">Go to Home</h5>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
