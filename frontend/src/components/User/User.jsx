import React from "react";
import { Link } from "react-router-dom";

const User = ({ userId, name, avatar }) => {
  return (
    <Link
      to={`/user/${userId}`}
      className="flex items-center space-x-4 p-4 border rounded-lg shadow-md hover:bg-gray-100"
    >
      <img src={avatar} alt={name} className="w-10 h-10 rounded-full" />
      <span className="text-lg font-semibold">{name}</span>
    </Link>
  );
};

export default User;
