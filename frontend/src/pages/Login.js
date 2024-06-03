import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import profile from "../assets/Profile.png";
import { useDispatch, useSelector } from "react-redux";
import { FaEye } from "react-icons/fa";
import { clearErrors, login } from "../components/redux/actions/userAction";
import { IoIosEyeOff } from "react-icons/io";
import toast from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { error, isAuthenticated } = useSelector((state) => state.user);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(email, password, navigate));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (isAuthenticated) {
      navigate("/");
    }
  }, [dispatch, error, isAuthenticated, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-teal-400 to-blue-500">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-sm">
        <div className="mb-3 text-center flex items-center justify-center flex-col">
          <h2 className="text-md  flex items-center justify-center font-semibold text-[rgba(0,182,182,0.89)] mb-3 -mt-11 w-36 h-11 bg-[rgb(0,245,225)]">
            SIGN IN
          </h2>
          <img
            src={profile}
            alt="profile"
            className="w-28 h-28 flex items-center justify-center"
          />
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-white mb-2" htmlFor="email">
              Email <span className=" text-[#FF0000]">*</span>
            </label>
            <input
              className="w-full p-2 text-gray-900 bg-gray-200 rounded"
              type="email"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Email id"
            />
          </div>
          <div className="mb-6">
            <label className="block text-white mb-2" htmlFor="password">
              Password <span className=" text-[#FF0000]">*</span>
            </label>
            <div className="flex items-center justify-center">
              <input
                className="w-full p-2 text-gray-900 bg-gray-200 rounded"
                type={showPassword ? "text" : "password"}
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
                id="password"
                placeholder="Enter Password"
              />
              {showPassword ? (
                <FaEye
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute text-xl translate-x-36"
                />
              ) : (
                <IoIosEyeOff
                  className="absolute text-xl translate-x-36"
                  onClick={() => setShowPassword(!showPassword)}
                />
              )}
            </div>
          </div>
          <div className="flex items-center justify-end mb-4 gap-1">
            <span className="text-white">Don't have an account?</span>
            <Link
              to="/registration"
              className="text-teal-200 hover:text-teal-400 hover:underline"
              title="not implemented"
            >
              Sign Up
            </Link>
          </div>
          <div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-[rgb(0,245,225)] hover:bg-teal-300 text-[#00B6B5] font-semibold rounded"
            >
              LOGIN
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
