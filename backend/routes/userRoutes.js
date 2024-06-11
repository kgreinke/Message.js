// routes/userRoutes.js

const express = require("express");
const {
  registerUser,
  authUser,
  allUsers,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Route        GET /api/user?search=
// Access       Protected
// Description  Get or search all users by user.name or user.email
router.route("/").get(protect, allUsers);

// Route        POST /api/user
// Access       Public
// Description  Register a new user
router.route("/").post(registerUser);

// Route        POST /api/users/login
// Access       Public
// Description  Authenticate user and get token
router.post("/login", authUser);

// Export router
module.exports = router;