import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../Loader/Loader";
import Post from "../Post/Post";
import { Link, useNavigate } from "react-router-dom";
import User from "../User/User";
import {
  deleteMyProfile,
  getMyPost,
  loadUser,
  logout,
} from "../redux/actions/userAction";
import { clearErrors, clearMessage } from "../redux/actions/postAction";
import toast from "react-hot-toast";

const Account = () => {
  const dispatch = useDispatch();
  const { loading, error, posts } = useSelector((state) => state.myPosts);
  console.log("posts", posts);
  const {
    error: likeError,
    message,
    loading: deleteLoading,
  } = useSelector((state) => state.like);
  const { user, loading: userLoading } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [followersToggle, setFollowersToggle] = useState(false);
  const [followingToggle, setFollowingToggle] = useState(false);

  const logoutHandler = async (e) => {
    await dispatch(logout());
    toast.success("Logout successfully");
    navigate("/login");
    dispatch(loadUser());
  };

  useEffect(() => {
    dispatch(getMyPost());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (likeError) {
      toast.error(likeError);
      dispatch(clearErrors());
    }

    if (message) {
      toast.success(message);
      dispatch(clearMessage());
    }
  }, [error, message, likeError, dispatch]);

  const handleDeleteProfile = async (e) => {
    e.preventDefault();
    await dispatch(deleteMyProfile());
    dispatch(logout());
  };

  return loading === true || userLoading === true ? (
    <Loader />
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_400px] h-[92vh]">
      <div className="bg-gradient-to-r from-[#fff5bc] to-[#cec1ff] flex flex-col gap-8 items-center p-8 overflow-y-auto">
        {posts && posts?.length > 0 ? (
          posts.map((post) => (
            <Post
              key={post?._id}
              postId={post?._id}
              caption={post?.caption}
              postImage={post?.image?.url}
              likes={post?.likes}
              comments={post?.comments}
              ownerImage={post?.owner?.avatar?.url}
              ownerName={post?.owner?.username}
              ownerId={post?.owner?._id}
              isAccount={true}
              isDelete={true}
            />
          ))
        ) : (
          <h6 className="text-xl">You have not made any post</h6>
        )}
      </div>
      <div className="flex flex-col items-center p-8 overflow-y-auto">
        <img
          src={user?.avatar?.url}
          alt="User Avatar"
          className="h-[8vmax] w-[8vmax] rounded-full transition-transform duration-500 hover:scale-110"
        />

        <h5 className="my-8 text-2xl">{user.name}</h5>
        <div className="flex flex-col items-center my-4">
          <button
            onClick={() => setFollowersToggle(!followersToggle)}
            className="border-none bg-white cursor-pointer transition-shadow duration-500 p-2 hover:shadow-md"
          >
            <span>Followers</span>
          </button>
          <span>{user.followers?.length}</span>
        </div>

        <div className="flex flex-col items-center my-4">
          <button
            onClick={() => setFollowingToggle(!followingToggle)}
            className="border-none bg-white cursor-pointer transition-shadow duration-500 p-2 hover:shadow-md"
          >
            <span>Following</span>
          </button>
          <span>{user.following?.length}</span>
        </div>

        <div className="flex flex-col items-center my-4">
          <span>Posts</span>
          <span>{user.posts?.length}</span>
        </div>
        <button
          onClick={logoutHandler}
          className="bg-blue-500 text-white py-2 px-4 rounded transition-transform duration-500 hover:scale-110"
        >
          Logout
        </button>

        <Link
          to="/update/profile"
          className="text-[#494949] no-underline font-light text-xl text-center mt-8 p-4 transition-shadow duration-500 hover:shadow-md"
        >
          Edit Profile
        </Link>

        <button
          onClick={handleDeleteProfile}
          disabled={deleteLoading}
          className="text-red-500 my-8 transition-transform duration-500 hover:scale-110"
        >
          Delete My Profile
        </button>

        {followersToggle && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg">
              <h4 className="text-2xl mb-4">Followers</h4>
              {user && user.followers?.length > 0 ? (
                user.followers.map((follower) => (
                  <User
                    key={follower._id}
                    userId={follower._id}
                    name={follower?.name}
                    avatar={follower?.avatar?.url}
                  />
                ))
              ) : (
                <p>You have no followers</p>
              )}
              <button
                onClick={() => setFollowersToggle(!followersToggle)}
                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {followingToggle && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg">
              <h4 className="text-2xl mb-4">Following</h4>

              {user && user.following?.length > 0 ? (
                user.following.map((follow) => (
                  <User
                    key={follow._id}
                    userId={follow._id}
                    name={follow?.name}
                    avatar={follow?.avatar?.url}
                  />
                ))
              ) : (
                <p className="my-8">You're not following anyone</p>
              )}
              <button
                onClick={() => setFollowingToggle(!followingToggle)}
                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Account;
