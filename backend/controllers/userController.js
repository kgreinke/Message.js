// controllers/userController.js

const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");

// Route        GET /api/user?search=
// Access       Protected
// Description  Get or search all users by user.name or user.email
const allUsers = asyncHandler(async (req, res) => {
  // Get search keyword from query parameters
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } }, // Case-insensitive search by name
          { email: { $regex: req.query.search, $options: "i" } }, // Case-insensitive search by email
        ],
      }
    : {};

  // Find users matching the keyword, excluding the requesting user
  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });

  // Send the list of users as response
  res.send(users);
});

// Route        POST /api/user
// Access       Protected
// Description  Register new user
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;

  // Check if all required fields are provided
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please Enter all the Feilds");
  }

  // Check if a user with the given email already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Create a new user
  const user = await User.create({
    name,
    email,
    password,
    pic,
  });

  // If user creation is successful, send user details and token as response
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("User not found");
  }
});

// Route        POST /api/users/login
// Access       Protected
// Description  User authentication by user.email and user.password
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find the user by email
  const user = await User.findOne({ email });

  // Check if user exists and if the password matches
  if (user && (await user.matchPassword(password))) {
    // Send user details and token as response
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid Email or Password");
  }
});

// Export the controller functions
module.exports = { allUsers, registerUser, authUser };