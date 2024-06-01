// Message Routes

const express = require('express');
const { allMessages, sendMessage } = require('../controllers/message-controller');
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/:roomId").get(protect, allMessages);
router.route("/").post(protect, sendMessage);

module.exports = router;