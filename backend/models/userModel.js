const mongoose = require("mongoose");
const validator = require("validator");
const bcryptjs = require("bcryptjs");
const JWT = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    sparse: true,
    index: true,
  },
  name: {
    type: String,
    required: [true, "Please Enter Your Name 🫡"],
    maxLength: [40, "Name cannot exceed 40 characters."],
    minLength: [4, "Name should have more than 4 character."],
  },
  avatar: {
    public_id: {
      type: String,
      required: false,
    },
    url: {
      type: String,
      required: false,
    },
  },
  email: {
    type: String,
    required: [true, "Please Enter Your Email 🫡"],
    unique: true,
    validate: [validator.isEmail, "Please Enter a valid Email"],
  },
  password: {
    type: String,
    required: [true, "Please Enter Your Password 🙈"],
    minLength: [8, "Password should be grate than 8 characters."],
    select: false,
  },

  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],

  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],

  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],

  role: {
    type: String,
    default: "user",
  },
  checkbox: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcryptjs.hash(this.password, 10);
});

//JWT Token
userSchema.methods.getJWTToken = function () {
  return JWT.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

//ComparePassword

userSchema.methods.comparePassword = async function (enterdPassword) {
  return await bcryptjs.compare(enterdPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
