const catchAsyncErrors = require("../middleware/catchAsyncErrors.js");
const Post = require("../models/postModel.js");
const User = require("../models/userModel.js");
const cloudinary = require("cloudinary");

exports.createPost = catchAsyncErrors(async (req, res, next) => {
  const myCloud = await cloudinary.v2.uploader.upload(req.body.image, {
    folder: "posts",
  });
  const newPostData = {
    caption: req.body.caption,
    image: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    },
    owner: req.user.id,
  };

  const post = await Post.create(newPostData);

  const user = await User.findById(req.user.id);
  user.posts.unshift(post._id);

  await user.save();
  res.status(201).json({
    success: true,
    message: "Post Created",
  });
});

//like and unlike post

exports.likeAndUnlikePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return next(new ErrorHandler("Post not found", 404));
    }

    if (post.likes.includes(req.user.id)) {
      //means already user likes post
      const index = post.likes.indexOf(req.user.id);
      post.likes.splice(index, 1);
      await post.save();
      return res.status(200).json({
        success: true,
        message: "Post Unliked",
      });
    } else {
      //if user is not liked post then i will push user id in likes array
      post.likes.push(req.user.id);
      await post.save();
      return res.status(200).json({
        success: true,
        message: "Post Liked",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//delete post

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    if (post.owner.toString() !== req.user.id.toString()) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    await cloudinary.v2.uploader.destroy(post.image.public_id);

    await post.deleteOne();

    const user = await User.findById(req.user.id);

    const index = user.posts.indexOf(req.params.id);
    user.posts.splice(index, 1);

    await user.save();

    res.status(200).json({
      success: true,
      message: "Post deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//GET POST OF FOLLOWING
exports.getPostOfFollowing = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    const posts = await Post.find({
      owner: {
        $in: user.following,
      },
    }).populate("owner likes comments.user");

    res.status(200).json({
      success: true,
      posts: posts.reverse(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateCaption = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return next(new ErrorHandler("Post does not exist with this id ", 404));
    }

    if (post.owner.toString() !== req.user.id.toString()) {
      return next(new ErrorHandler("You are not authorized to delete", 401));
    }

    post.caption = req.body.caption;
    await post.save();
    res.status(200).json({
      success: true,
      message: "Post updated",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.commentOnPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return next(new ErrorHandler("Post not found", 404));
    }

    let commentIndex = -1; // This variable will be used to track the index of the existing comment by the same user, if found.

    post.comments.forEach((item, index) => {
      //check commenting user id matches with authenticated user id
      if (item.user.toString() === req.user.id.toString()) {
        //If they match, it updates the commentIndex variable with the index of the found comment.
        commentIndex = index;
      }
    });

    if (commentIndex !== -1) {
      post.comments[commentIndex].comment = req.body.comment;
      await post.save();
      return res.status(200).json({
        success: true,
        message: "Comment Updated",
      });
    } else {
      //if commentIndex is not found
      post.comments.push({
        user: req.user.id,
        comment: req.body.comment,
      });
      await post.save();
      return res.status(200).json({
        success: true,
        message: "Comment added",
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//delete comment
exports.deleteComment = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return next(new ErrorHandler("Post not found", 404));
    }

    // Checking If owner wants to delete

    if (post.owner.toString() === req.user.id.toString()) {
      if (req.body.commentId === undefined) {
        return res.status(400).json({
          success: false,
          message: "Comment Id is required",
        });
      }

      post.comments.forEach((item, index) => {
        if (item._id.toString() === req.body.commentId.toString()) {
          return post.comments.splice(index, 1);
        }
      });

      await post.save();

      return res.status(200).json({
        success: true,
        message: "Selected Comment has deleted",
      });
    } else {
      post.comments.forEach((item, index) => {
        if (item.user.toString() === req.user.id.toString()) {
          return post.comments.splice(index, 1);
        }
      });

      await post.save();

      return res.status(200).json({
        success: true,
        message: "Your Comment has deleted",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
