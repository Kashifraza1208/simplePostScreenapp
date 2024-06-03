import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  clearErrors,
  clearMessage,
  createNewPost,
} from "../redux/actions/postAction";
import { loadUser } from "../redux/actions/userAction";
import toast from "react-hot-toast";

const NewPost = () => {
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState("");
  const { loading, error, message } = useSelector((state) => state.like);
  const dispatch = useDispatch();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const Reader = new FileReader();
    Reader.readAsDataURL(file);
    Reader.onload = () => {
      if (Reader.readyState === 2) {
        setImage(Reader.result);
      }
    };
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    await dispatch(createNewPost(caption, image));
    dispatch(loadUser());
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (message) {
      toast.success(message);
      dispatch(clearMessage());
    }
  }, [error, message, dispatch]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#fff5bc] to-[#cec1ff] flex items-center justify-center p-8 box-border">
      <form
        className="bg-white h-full w-1/2 rounded-3xl p-8 flex flex-col items-center"
        onSubmit={submitHandler}
      >
        <h3 className="text-3xl mb-8">New Post</h3>
        {image && (
          <img src={image} alt="post" className="w-full object-cover mb-8" />
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full mb-8 p-4 rounded-3xl"
        />
        <input
          type="text"
          placeholder="Caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="w-full p-4 rounded-3xl mb-8 border-none outline-none font-light text-lg"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-700 text-white w-full p-2 rounded-3xl font-light text-lg"
        >
          Post
        </button>
      </form>
    </div>
  );
};

export default NewPost;
