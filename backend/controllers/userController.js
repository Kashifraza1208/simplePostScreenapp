const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");
const Post = require("../models/postModel");
const cloudinary = require("cloudinary");

const sendToken = require("../utils/jwtToken");

//Registe User
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
    folder: "avatars",
    width: 150,
    crop: "scale",
  });

  const { username, email, password, confirmPassword, checkbox, name } =
    req.body;

  const usernamePresent = await User.findOne({ username });

  if (usernamePresent) {
    return next(new ErrorHandler("Username already exists!", 400));
  }

  const emailPresent = await User.findOne({ email });

  if (emailPresent) {
    return next(new ErrorHandler("Email already exists!", 400));
  }

  if (password !== confirmPassword) {
    return next(new ErrorHandler("Password don't match", 400));
  }

  const user = await User.create({
    username,
    email,
    password,
    avatar: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    },
    checkbox,
    name,
  });

  sendToken(user, 201, res);
});

//Login User
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  //if user has given password and email both

  if (!email || !password) {
    return next(new ErrorHandler("Please Enter Email & Password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid Email or Password", 401));
  }

  //must use await i waste 2 hour for this shit await
  const isPasswordMatced = await user.comparePassword(password);

  if (!isPasswordMatced) {
    return next(new ErrorHandler("Invalid Password", 401));
  }

  sendToken(user, 200, res);
});

//Logout User
exports.logOut = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out.",
  });
});

exports.getAllUser = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find({});
  console.log(users);
  res.status(200).json({
    success: true,
    users,
  });
});

exports.followUser = async (req, res, next) => {
  try {
    const targetUser = await User.findById(req.params.id);
    const loggedUser = await User.findById(req.user.id); //means authenticated user saved in mongodb

    if (!targetUser || !loggedUser) {
      return next(new ErrorHandler("User not found", 404));
    }

    // Check if the authenticated user is already following the target user
    if (loggedUser.following.includes(targetUser._id)) {
      const indexfollowing = loggedUser.following.indexOf(targetUser._id);
      const indexfollower = targetUser.followers.indexOf(loggedUser._id);

      loggedUser.following.splice(indexfollowing, 1);
      targetUser.followers.splice(indexfollower, 1);

      //saved back in database
      await loggedUser.save();
      await targetUser.save();

      res.status(200).json({
        success: true,
        message: "User unfollowed",
      });
    } else {
      loggedUser.following.push(targetUser._id);
      targetUser.followers.push(loggedUser._id);

      await loggedUser.save();
      await targetUser.save();
      res.status(200).json({
        success: true,
        message: "User followed",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const { name, email, avatar } = req.body;

    if (name) {
      user.name = name;
    }
    if (email) {
      user.email = email;
    }

    if (avatar) {
      // first destroy
      await cloudinary.v2.uploader.destroy(user.avatar.public_id);
      const myCloud = await cloudinary.v2.uploader.upload(avatar, {
        folder: "avatars",
      });
      user.avatar.public_id = myCloud.public_id;
      user.avatar.url = myCloud.secure_url;
    }

    await user.save();
    res.status(200).json({
      success: true,
      message: "Profile Updated Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//delete my profile
exports.deleteMyProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const posts = user.posts;
    const followers = user.followers;
    const following = user.following;
    const userId = user._id;

    //remove avatar
    await cloudinary.v2.uploader.destroy(user.avatar.public_id);

    await user.deleteOne();

    //logout user after deleting profile
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });

    //whenever i am deleting user profile, we have to delete posts associated with user
    for (let i = 0; i < posts.length; i++) {
      const post = await Post.findById(posts[i]);
      await cloudinary.v2.uploader.destroy(post.image.public_id);
      await post.deleteOne();
    }

    // Removing User from Followers Following
    for (let i = 0; i < followers.length; i++) {
      const follower = await User.findById(followers[i]);

      const index = follower.following.indexOf(userId);
      follower.following.splice(index, 1);
      await follower.save();
    }

    // Removing User from Following's Followers
    for (let i = 0; i < following.length; i++) {
      const follows = await User.findById(following[i]);

      const index = follows.followers.indexOf(userId);
      follows.followers.splice(index, 1);
      await follows.save();
    }

    // removing all comments of the user from all posts
    const allPosts = await Post.find();

    for (let i = 0; i < allPosts.length; i++) {
      const post = await Post.findById(allPosts[i]._id);

      for (let j = 0; j < post.comments.length; j++) {
        if (post.comments[j].user === userId) {
          post.comments.splice(j, 1);
        }
      }
      await post.save();
    }
    // removing all likes of the user from all posts

    for (let i = 0; i < allPosts.length; i++) {
      const post = await Post.findById(allPosts[i]._id);

      for (let j = 0; j < post.likes.length; j++) {
        if (post.likes[j] === userId) {
          post.likes.splice(j, 1);
        }
      }
      await post.save();
    }

    res.status(200).json({
      success: true,
      message: "Profile Deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//my profile it will give my profile information

exports.myProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate(
      "posts followers following"
    );

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//actually myProfile and getUserProfile both are same only differences are myProfile will give only own profile and getUserProfile get any user profile after passging id
exports.getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).populate(
      "posts followers following"
    );
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//getAllUsers

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({
      name: { $regex: req.query.name, $options: "i" },
    });

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getMyPosts = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    const posts = [];

    for (let i = 0; i < user.posts.length; i++) {
      const post = await Post.findById(user.posts[i]).populate(
        "likes comments.user owner"
      );
      posts.push(post);
    }
    res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getUserPosts = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    const posts = [];

    for (let i = 0; i < user.posts.length; i++) {
      const post = await Post.findById(user.posts[i]).populate(
        "likes comments.user owner"
      );
      posts.push(post);
    }
    res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
