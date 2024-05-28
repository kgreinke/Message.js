// Message Routes

const express = require('express');
const { allMessages, sendMessage } = require('../controllers/message-controller');

const router = express.Router();

router.get("/:roomId")
router.post("/", sendMessage);

module.exports = router;