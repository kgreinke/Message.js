// routes/messageRoutes.js

const express = require('express');
const { allMessages, sendMessage } = require("../controllers/messageController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Route        GET /api/message/:chatId
// Access       Protected
// Description  Get all messages for a specific chat
router.route("/:chatId").get(protect, allMessages);

// Route        POST /api/message
// Access       Protected
// Description  Send a new message in a specific chat
router.route("/").post(protect, sendMessage);

// Export router
module.exports = router;