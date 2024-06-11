// middleware/authMiddleware.js

const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");
const asyncHandler = require("express-async-handler");

// Middleware to protect routes by verifying JWT token
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check if authorization header is present and starts with "Bearer"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extract the token from the authorization header
      token = req.headers.authorization.split(" ")[1];

      // Decode the token to get the user ID
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user by ID and exclude the password field
      req.user = await User.findById(decoded.id).select("-password");

      // Call the next middleware
      next();
    } catch (error) {
      // If token verification fails, respond with a 401 status and error message
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  // If no token is found, respond with a 401 status and error message
  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

// Export middleware
module.exports = { protect };