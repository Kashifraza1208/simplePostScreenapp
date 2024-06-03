const {
  registerUser,
  loginUser,
  logOut,
  updateProfile,
  deleteMyProfile,
  myProfile,
  getUserProfile,
  getAllUsers,
  getMyPosts,
  getUserPosts,
  followUser,
} = require("../controllers/userController");
const { isAuthenticatedUser } = require("../middleware/auth");
const express = require("express");
const router = express.Router();

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/logout").get(logOut);

router.route("/follow/:id").get(isAuthenticatedUser, followUser);
router.route("/update/profile").put(isAuthenticatedUser, updateProfile);
router.route("/delete/me").delete(isAuthenticatedUser, deleteMyProfile);
router.route("/me").get(isAuthenticatedUser, myProfile);
router.route("/my/posts").get(isAuthenticatedUser, getMyPosts);
router.route("/userposts/:id").get(isAuthenticatedUser, getUserPosts);
router.route("/user/:id").get(isAuthenticatedUser, getUserProfile);
router.route("/users").get(isAuthenticatedUser, getAllUsers);


module.exports = router;
