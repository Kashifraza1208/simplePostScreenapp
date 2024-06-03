import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { getAllUsers } from "../redux/actions/userAction";
import User from "../User/User";

const Search = () => {
  const [name, setName] = React.useState("");

  const { users, loading } = useSelector((state) => state.allUsers);

  const dispatch = useDispatch();
  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(getAllUsers(name));
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#fff5bc] to-[#cec1ff] flex items-center justify-center p-8 box-border">
      <form
        className="bg-white h-full w-1/2 rounded-3xl p-8 flex flex-col items-center"
        onSubmit={submitHandler}
      >
        <h3 className="text-3xl py-8">Social App</h3>

        <input
          type="text"
          value={name}
          placeholder="Name"
          required
          onChange={(e) => setName(e.target.value)}
          className="box-border p-4 w-4/5 rounded-full border border-gray-300 my-8 text-xl outline-none"
        />

        <button
          type="submit"
          disabled={loading}
          className={`bg-blue-500 text-white py-2 px-6 rounded-full ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Search
        </button>

        <div className="w-full h-full overflow-y-auto p-8 box-border my-8">
          {users &&
            users.map((user) => (
              <User
                key={user._id}
                userId={user._id}
                name={user.name}
                avatar={user.avatar?.url}
              />
            ))}
        </div>
      </form>
    </div>
  );
};

export default Search;
