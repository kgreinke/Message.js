// routes/chatRoutes.js

const express = require("express");
const { protect } = require ("../middleware/authMiddleware");
const { accessChat, fetchChats, createGroupChat, renameGroup, addToGroup, removeFromGroup } = require("../controllers/chatControllers");

const router = express.Router();

// Route        POST /api/chat
// Access       Protected
// Description  Create or fetch a chat
router.route('/').post(protect, accessChat);

// Route        GET /api/chat
// Access       Protected
// Description  Fetch all chats for the logged-in user
router.route('/').get(protect, fetchChats);

// Route        POST /api/chat/group
// Access       Protected
// Description  Create a new group chat
router.route("/group").post(protect, createGroupChat);

// Route        PUT /api/chat/rename
// Access       Protected
// Description  Rename an existing group chat
router.route("/rename").put(protect, renameGroup);

// Route        PUT /api/chat/groupremove
// Access       Protected
// Description  Remove a user from a group chat
router.route("/groupremove").put(protect, removeFromGroup);

// Route        PUT /api/chat/groupadd
// Access       Protected
// Description  Add a user to a group chat
router.route("/groupadd").put(protect, addToGroup);

// Export router
module.exports = router;