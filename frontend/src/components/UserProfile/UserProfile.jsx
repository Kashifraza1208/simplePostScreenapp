import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Loader from "../Loader/Loader";
import Post from "../Post/Post";
import User from "../User/User";
import {
  followAndUnfollowUser,
  getUserPosts,
  getUserProfile,
} from "../redux/actions/userAction";
import { clearErrors, clearMessage } from "../redux/actions/postAction";
import toast from "react-hot-toast";

const UserProfile = () => {
  const dispatch = useDispatch();

  const { id } = useParams();
  const {
    user,
    loading: userLoading,
    error: userError,
  } = useSelector((state) => state.userProfile);
  const { user: me } = useSelector((state) => state.user);
  const { loading, error, posts } = useSelector((state) => state.userPosts);
  const {
    error: followError,
    message,
    loading: followLoading,
  } = useSelector((state) => state.like);
  const [followersToggle, setFollowersToggle] = useState(false);
  const [followingToggle, setFollowingToggle] = useState(false);
  const [following, setFollowing] = useState(false);
  const [myProfile, setMyProfile] = useState(false);

  const followHandler = async () => {
    setFollowing(!following);
    await dispatch(followAndUnfollowUser(user._id));
    dispatch(getUserProfile(id));
  };

  useEffect(() => {
    dispatch(getUserPosts(id));
    dispatch(getUserProfile(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (me._id === id) {
      setMyProfile(true);
    }
    if (user) {
      user?.followers?.forEach((item) => {
        if (item._id === me._id) {
          setFollowing(true);
        } else {
          setFollowing(false);
        }
      });
    }
  }, [user, me._id, id]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (followError) {
      toast.error(followError);
      dispatch(clearErrors());
    }

    if (userError) {
      toast.error(userError);
      dispatch(clearErrors());
    }
    if (message) {
      toast.success(message);
      dispatch(clearMessage());
    }
  }, [error, message, followError, userError, dispatch]);

  return loading === true || userLoading === true ? (
    <Loader />
  ) : (
    <div className="flex flex-col md:flex-row items-start justify-center min-h-screen bg-gradient-to-r from-[#fff5bc] to-[#cec1ff] p-8 box-border">
      <div className="w-full md:w-2/3">
        {posts && posts?.length > 0 ? (
          posts.map((post) => (
            <Post
              key={post._id}
              postId={post._id}
              caption={post.caption}
              postImage={post.image?.url}
              likes={post.likes}
              comments={post.comments}
              ownerImage={post.owner.avatar?.url}
              ownerName={post.owner.name}
              ownerId={post.owner._id}
            />
          ))
        ) : (
          <h6 className="text-xl">User has not made any post</h6>
        )}
      </div>
      <div className="w-full md:w-1/3 flex flex-col items-center">
        {user && (
          <>
            <img
              src={user.avatar?.url}
              alt={user.name}
              className="w-32 h-32 rounded-full"
            />
            <h5 className="text-2xl my-4">{user.name}</h5>
            <div className="flex flex-col items-center my-4">
              <button
                onClick={() => setFollowersToggle(!followersToggle)}
                className="text-blue-500"
              >
                Followers
              </button>
              <span>{user.followers?.length}</span>
            </div>
            <div className="flex flex-col items-center my-4">
              <button
                onClick={() => setFollowingToggle(!followingToggle)}
                className="text-blue-500"
              >
                Following
              </button>
              <span>{user.following?.length}</span>
            </div>
            <div className="flex flex-col items-center my-4">
              <span>Posts</span>
              <span>{user.posts?.length}</span>
            </div>
            {!myProfile && (
              <button
                onClick={followHandler}
                disabled={followLoading}
                className={`px-4 py-2 mt-4 rounded-full text-white ${
                  following ? "bg-red-500" : "bg-blue-500"
                } ${followLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {following ? "Unfollow" : "Follow"}
              </button>
            )}
          </>
        )}
        {followersToggle && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
            onClick={() => setFollowersToggle(!followersToggle)}
          >
            <div
              className="bg-white p-6 rounded-lg w-11/12 md:w-1/2"
              onClick={(e) => e.stopPropagation()}
            >
              <h4 className="text-2xl mb-4">Followers</h4>
              {user && user.followers?.length > 0 ? (
                user.followers.map((follower) => (
                  <User
                    key={follower._id}
                    userId={follower._id}
                    name={follower.name}
                    avatar={follower.avatar?.url}
                  />
                ))
              ) : (
                <p className="m-8">You have no followers</p>
              )}
            </div>
          </div>
        )}
        {followingToggle && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
            onClick={() => setFollowingToggle(!followingToggle)}
          >
            <div
              className="bg-white p-6 rounded-lg w-11/12 md:w-1/2"
              onClick={(e) => e.stopPropagation()}
            >
              <h4 className="text-2xl mb-4">Following</h4>
              {user && user.following?.length > 0 ? (
                user.following.map((follow) => (
                  <User
                    key={follow._id}
                    userId={follow._id}
                    name={follow.name}
                    avatar={follow.avatar?.url}
                  />
                ))
              ) : (
                <p className="m-8">You're not following anyone</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
