const express = require("express");
const {
  createPost,
  likeAndUnlikePost,
  deletePost,
  getPostOfFollowing,
  updateCaption,
  commentOnPost,
  deleteComment,
} = require("../controllers/postController");
const { isAuthenticatedUser } = require("../middleware/auth");

const router = express.Router();

router.route("/post/upload").post(isAuthenticatedUser, createPost);
router
  .route("/post/:id")
  .get(isAuthenticatedUser, likeAndUnlikePost)
  .put(isAuthenticatedUser, updateCaption)
  .delete(isAuthenticatedUser, deletePost);
router.route("/posts").get(isAuthenticatedUser, getPostOfFollowing);

router.route("/post/comment/:id").put(isAuthenticatedUser, commentOnPost);
router.route("/post/comment/:id").delete(isAuthenticatedUser, deleteComment);

module.exports = router;
