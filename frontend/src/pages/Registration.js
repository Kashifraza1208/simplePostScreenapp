import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { clearErrors, register } from "../components/redux/actions/userAction";
import { IoIosEyeOff } from "react-icons/io";
import { FaEye } from "react-icons/fa";
import toast from "react-hot-toast";
import profile from "../assets/Profile.png";

const Registration = () => {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [checkbox, setCheckbox] = useState(false);
  const [name, setName] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowCofirmPassword] = useState(false);

  const [avatar, setAvatar] = useState(profile);
  const [avatarPreview, setAvatarPreview] = useState(profile);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { error, isAuthenticated } = useSelector((state) => state.user);

  const handleSubmit = (e) => {
    e.preventDefault();

    const myForm = new FormData();

    myForm.set("username", username);
    myForm.set("email", email);
    myForm.set("name", name);
    myForm.set("password", password);
    myForm.set("confirmPassword", confirmPassword);
    myForm.set("checkbox", checkbox);
    myForm.set("avatar", avatar);
    dispatch(
      register(
        username,
        email,
        password,
        confirmPassword,
        name,
        myForm,
        navigate
      )
    );
  };

  const registerDataChange = (e) => {
    if (e.target.name === "avatar") {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          console.log(reader.result);
          setAvatarPreview(reader.result);
          setAvatar(reader.result);
        }
      };

      reader.readAsDataURL(e.target.files[0]);
    }
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
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-sm mt-5">
        <div className="mb-3 text-center flex items-center justify-center flex-col">
          <h2 className="text-xl  flex items-center justify-center font-semibold text-[#00B6B5] mb-3 -mt-11 w-36 h-11 bg-[rgb(0,245,225)]">
            SIGN UP
          </h2>
        </div>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="mb-4">
            <label className="block text-white mb-2" htmlFor="username">
              Username <span className=" text-[#FF0000]">*</span>
            </label>
            <input
              className="w-full p-2 text-gray-900 bg-gray-200 rounded"
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter UserName"
            />
          </div>

          <div className="mb-4">
            <label className="block text-white mb-2" htmlFor="email">
              Email <span className=" text-[#FF0000]">*</span>
            </label>
            <input
              className="w-full p-2 text-gray-900 bg-gray-200 rounded"
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Email id"
            />
          </div>
          <div className="mb-4">
            <label className="block text-white mb-2" htmlFor="name">
              Name <span className=" text-[#FF0000]">*</span>
            </label>
            <input
              className="w-full p-2 text-gray-900 bg-gray-200 rounded"
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter Name"
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
          <div className="mb-6">
            <label className="block text-white mb-2" htmlFor="confirmPassword">
              Confirm Password <span className=" text-[#FF0000]">*</span>
            </label>
            <div className="flex items-center justify-center">
              <input
                className="w-full p-2 text-gray-900 bg-gray-200 rounded"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                id="confirmPassword"
                placeholder="Enter Confirm Password"
              />
              {showConfirmPassword ? (
                <FaEye
                  onClick={() => setShowCofirmPassword(!showConfirmPassword)}
                  className="absolute text-xl translate-x-36"
                />
              ) : (
                <IoIosEyeOff
                  className="absolute text-xl translate-x-36"
                  onClick={() => setShowCofirmPassword(!showConfirmPassword)}
                />
              )}
            </div>
          </div>
          <div className="flex items-center justify-center gap-3">
            <img
              src={avatarPreview}
              alt="Avatar Preview"
              className="w-12 h-12"
            />
            <span className=" text-[#FF0000]">*</span>
            <input
              type="file"
              name="avatar"
              accept="image/*" //any type of image acceptable
              autoComplete="off"
              onChange={registerDataChange}
            />
          </div>
          <div className="flex items-center justify-end mb-4 gap-1">
            <span className="text-white">Already have an account?</span>
            <Link
              to="/login"
              className="text-teal-200 hover:text-teal-400 hover:underline"
              title="not implemented"
            >
              Sign In
            </Link>
          </div>
          <div className="fflex items-center justify-start mb-3 ">
            <span className="text-[#0247FE] hover:underline cursor-pointer">
              Terms and Conditions
            </span>
            <input
              type="checkbox"
              value={checkbox}
              className="w-7 h-4"
              onChange={(e) => setCheckbox(e.target.checked)}
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-[rgb(0,245,225)] hover:bg-teal-300 text-[#00B6B5] font-bold rounded"
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Registration;
