import React, { useEffect } from "react";
import Post from "../Post/Post";
import User from "../User/User";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../Loader/Loader";
import toast from "react-hot-toast";
import { getAllUsers, getFollowingPosts } from "../redux/actions/userAction";
import { clearErrors, clearMessage } from "../redux/actions/postAction";

const Home = () => {
  const dispatch = useDispatch();

  const { loading, posts, error } = useSelector(
    (state) => state.postOfFollowing
  );

  const { users, loading: usersLoading } = useSelector(
    (state) => state.allUsers
  );

  console.log("object ,", users);

  const { error: likeError, message } = useSelector((state) => state.like);

  useEffect(() => {
    dispatch(getFollowingPosts());
    dispatch(getAllUsers());
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

  return loading === true || usersLoading === true ? (
    <Loader />
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_400px] h-screen box-border">
      <div className="bg-gradient-to-r gap-4 from-[#fff5bc] to-[#cec1ff] overflow-y-auto flex flex-col items-center p-8 box-border">
        {posts && posts?.length > 0 ? (
          posts.map((post) => (
            <Post
              key={post._id}
              postId={post._id}
              caption={post.caption}
              postImage={post?.image?.url}
              likes={post.likes}
              comments={post.comments}
              ownerImage={post.owner.avatar?.url}
              ownerName={post.owner?.name}
              ownerId={post.owner._id}
            />
          ))
        ) : (
          <span className="text-lg font-semibold">No posts yet</span>
        )}
      </div>
      <div className="p-8 box-border overflow-y-auto">
        {users && users?.length > 0 ? (
          users.map((user) => (
            <User
              key={user._id}
              userId={user._id}
              name={user?.name}
              avatar={user.avatar?.url}
            />
          ))
        ) : (
          <span className="text-lg font-semibold">No Users Yet</span>
        )}
      </div>
    </div>
  );
};

export default Home;
