import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deleteComment } from "../redux/actions/postAction";
import { getFollowingPosts, getMyPost } from "../redux/actions/userAction";
import { BsTrash } from "react-icons/bs";

const CommentCard = ({
  userId,
  name,
  avatar,
  comment,
  commentId,
  postId,
  isAccount,
}) => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const deleteCommentHandler = (e) => {
    e.preventDefault();

    dispatch(deleteComment(postId, commentId));
    if (isAccount) {
      dispatch(getMyPost());
    } else {
      dispatch(getFollowingPosts());
    }
  };

  return (
    <div className="commentUser flex items-center text-gray-500 mt-3">
      <Link to={`/user/${userId}`} className="flex items-center text-black">
        <img
          src={avatar}
          alt={name}
          className="h-12 w-12 rounded-full border-4 border-pink-200"
        />
        <span className="ml-4">{name}</span>
      </Link>
      <span>{comment}</span>
      {(isAccount || userId === user._id) && (
        <BsTrash
          onClick={deleteCommentHandler}
          className="text-red-500 h-5 w-5 ms-3"
        />
      )}
    </div>
  );
};

export default CommentCard;
