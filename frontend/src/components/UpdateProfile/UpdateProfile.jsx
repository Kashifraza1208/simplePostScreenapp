import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useNavigate } from "react-router-dom";
import {
  clearErrors,
  clearMessage,
  loadUser,
  updateProfile,
} from "../redux/actions/userAction";
import Loader from "../Loader/Loader";
import toast from "react-hot-toast";

const UpdateProfile = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { loading, error, user } = useSelector((state) => state.user);
  const {
    loading: updateLoading,
    error: updateError,
    message,
  } = useSelector((state) => state.like);

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [avatar, setAvatar] = useState("");
  const [avatarPrev, setAvatarPrev] = useState(user.avatar?.url);

  const submitHandler = async (e) => {
    e.preventDefault();
    await dispatch(updateProfile(name, email, avatar));
    dispatch(loadUser());
    navigate("/account");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const Reader = new FileReader();
    Reader.readAsDataURL(file);
    Reader.onload = () => {
      if (Reader.readyState === 2) {
        setAvatarPrev(Reader.result);
        setAvatar(Reader.result);
      }
    };
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (updateError) {
      toast.error(updateError);
      dispatch(clearErrors());
    }

    if (message) {
      toast.success(message);
      dispatch(clearMessage());
    }
  }, [dispatch, error, updateError, message]);

  return loading ? (
    <Loader />
  ) : (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#fff5bc] to-[#cec1ff] p-8 box-border">
      <form
        className="bg-white w-full md:w-1/2 rounded-3xl box-border p-8 flex flex-col items-center"
        onSubmit={submitHandler}
      >
        <h3 className="text-3xl mb-8">Social App</h3>

        <img
          src={avatarPrev}
          alt="User"
          className="w-40 h-40 rounded-full mb-8"
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full mb-8 rounded-lg border p-2"
        />

        <input
          type="text"
          placeholder="Name"
          required
          value={name}
          className="w-full mb-8 rounded-full border p-4"
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          className="w-full mb-8 rounded-full border p-4"
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          type="submit"
          disabled={updateLoading}
          className={`px-6 py-2 rounded-full text-white ${
            updateLoading
              ? "bg-blue-500 opacity-50 cursor-not-allowed"
              : "bg-blue-500"
          }`}
        >
          Update
        </button>
      </form>
    </div>
  );
};

export default UpdateProfile;
