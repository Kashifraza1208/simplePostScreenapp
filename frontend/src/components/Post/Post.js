import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  BsThreeDots,
  BsHeart,
  BsHeartFill,
  BsChat,
  BsTrash,
} from "react-icons/bs";
import {
  commentOnPost,
  deletePost,
  likePost,
  updateCaption,
} from "../redux/actions/postAction";
import {
  getFollowingPosts,
  getMyPost,
  loadUser,
} from "../redux/actions/userAction";
import User from "../User/User";
import CommentCard from "../CommentCard/CommentCard";

const Post = ({
  postId,
  caption,
  postImage,
  likes = [],
  comments = [],
  ownerImage,
  ownerName,
  ownerId,
  isDelete = false,
  isAccount = false,
}) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const [liked, setLiked] = useState(false);
  const [likesUser, setLikesUser] = useState(false);
  const [commentsValue, setCommentsValue] = useState("");
  const [commentToggle, setCommentToggle] = useState(false);
  const [captionValue, setCaptionValue] = useState(caption);
  const [captionToggle, setCaptionToggle] = useState(false);

  const handleLike = async (e) => {
    e.preventDefault();
    setLiked(!liked);
    await dispatch(likePost(postId));
    if (isAccount) {
      dispatch(getMyPost());
    } else {
      dispatch(getFollowingPosts());
    }
  };

  useEffect(() => {
    likes.forEach((item) => {
      if (item._id === user._id) {
        setLiked(true);
      }
    });
  }, [likes, user._id]);

  const addCommentHandler = async (e) => {
    await dispatch(commentOnPost(postId, commentsValue));
    if (isAccount) {
      dispatch(getMyPost());
    } else {
      dispatch(getFollowingPosts());
    }
  };

  const updateCaptionHandler = (e) => {
    dispatch(updateCaption(captionValue, postId));
    dispatch(getMyPost());
  };

  const deletePostHandler = async (e) => {
    await dispatch(deletePost(postId));
    dispatch(getMyPost());
    dispatch(loadUser());
  };

  const popupRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setCommentToggle(false);
      }
    };

    if (commentToggle) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [commentToggle]);

  return (
    <div className="post bg-white rounded-lg shadow-md p-4 w-1/2">
      <div className="postHeader flex justify-end items-center">
        {isAccount && (
          <button onClick={() => setCaptionToggle(!captionToggle)}>
            <BsThreeDots className="h-5 w-5 text-gray-500" />
          </button>
        )}
      </div>
      <img src={postImage} alt="" className="w-full" />
      <div className="postDetails flex items-center p-4">
        <img src={ownerImage} alt="User" className="h-12 w-12 rounded-full" />
        <Link to={`/user/${ownerId}`} className="ml-4 font-semibold text-black">
          {ownerName}
        </Link>
        <p className="text-sm text-gray-500 ms-2">{caption}</p>
      </div>
      <button
        onClick={() => setLikesUser(!likesUser)}
        className="border-none bg-white cursor-pointer"
        disabled={likes?.length === 0 ? true : false}
      >
        <p className="">{likes?.length} Likes</p>
      </button>
      <div className="postFooter flex items-center gap-6">
        <button onClick={handleLike}>
          {liked ? (
            <BsHeartFill className="h-5 w-5 text-red-500" />
          ) : (
            <BsHeart className="h-5 w-5" />
          )}
        </button>
        <button onClick={() => setCommentToggle(!commentToggle)}>
          <BsChat className="h-5 w-5" />
        </button>{" "}
        {isDelete && (
          <button onClick={deletePostHandler}>
            <BsTrash className="h-5 w-5" />
          </button>
        )}
      </div>
      {likesUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-25 z-50">
          <div className="bg-white p-4 rounded-lg">
            <h4 className="text-2xl">Liked By</h4>
            {likes.map((like) => (
              <User
                key={like._id}
                userId={like._id}
                name={like?.name}
                avatar={like?.avatar?.url}
              />
            ))}
          </div>
        </div>
      )}
      {commentToggle && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-25 z-50 gap-11">
          <div
            className="bg-white p-4 rounded-lg w-1/3 h-1/2 gap-6"
            ref={popupRef}
          >
            <h4 className="text-2xl">Comments</h4>
            <form className="w-full flex" onSubmit={addCommentHandler}>
              <input
                type="text"
                value={commentsValue}
                placeholder="comment here..."
                onChange={(e) => setCommentsValue(e.target.value)}
                required
                className="w-full py-2 px-4 border border-gray-300 rounded-l-lg focus:outline-none focus:ring focus:border-blue-300"
              />
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded-r-lg"
              >
                Add
              </button>
            </form>
            {comments && comments?.length > 0 ? (
              //userId, name, avatar, comment, commentId, postId
              comments.map((item) => (
                <CommentCard
                  key={item?._id}
                  userId={item.user?._id}
                  name={item.user?.name}
                  avatar={item.user?.avatar?.url}
                  comment={item.comment}
                  commentId={item._id}
                  postId={postId}
                  isAccount={isAccount}
                />
              ))
            ) : (
              <p>No Comment Yet</p>
            )}
          </div>
        </div>
      )}
      {captionToggle && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-25 z-50">
          <div className="bg-white p-4 rounded-lg">
            <h4 className="text-2xl">Caption</h4>
            <form className="commentForm" onSubmit={updateCaptionHandler}>
              <input
                type="text"
                value={captionValue}
                placeholder="Caption here..."
                onChange={(e) => setCaptionValue(e.target.value)}
                required
                className="w-full py-2 px-4 border border-gray-300 rounded-l-lg focus:outline-none focus:ring focus:border-blue-300"
              />
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded-r-lg"
              >
                Update
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Post;
