import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaHome,
  FaRegPlusSquare,
  FaSearch,
  FaUserCircle,
  FaRegUserCircle,
} from "react-icons/fa";

const Header = () => {
  const [tab, setTab] = useState(window.location.pathname);

  return (
    <div className="flex justify-center items-center md:mr-56 gap-16">
      <img
        className="h-16 w-40"
        src="https://img.freepik.com/free-vector/social-media-logo-collection_69286-193.jpg?w=2000"
        alt="Logo"
      />
      <Link to="/" onClick={() => setTab("/")}>
        {tab === "/" ? (
          <FaHome className="text-black text-2xl transition-transform duration-500 transform hover:scale-125" />
        ) : (
          <FaHome className="text-gray-700 text-2xl transition-transform duration-500 transform hover:scale-125" />
        )}
      </Link>

      <Link to="/newpost" onClick={() => setTab("/newpost")}>
        {tab === "/newpost" ? (
          <FaRegPlusSquare className="text-black text-2xl transition-transform duration-500 transform hover:scale-125" />
        ) : (
          <FaRegPlusSquare className="text-gray-700 text-2xl transition-transform duration-500 transform hover:scale-125" />
        )}
      </Link>

      <Link to="/search" onClick={() => setTab("/search")}>
        {tab === "/search" ? (
          <FaSearch className="text-black text-2xl transition-transform duration-500 transform hover:scale-125" />
        ) : (
          <FaSearch className="text-gray-700 text-2xl transition-transform duration-500 transform hover:scale-125" />
        )}
      </Link>

      <Link to="/account" onClick={() => setTab("/account")}>
        {tab === "/account" ? (
          <FaUserCircle className="text-black text-2xl transition-transform duration-500 transform hover:scale-125" />
        ) : (
          <FaRegUserCircle className="text-gray-700 text-2xl transition-transform duration-500 transform hover:scale-125" />
        )}
      </Link>
    </div>
  );
};

export default Header;
