// Chatroom Routees

const express = require('express');
const { fetchChat, fetchChatRooms, removeFromChatRoom } = require('../controllers/chatroom-controller');

const router = express.Router();

router.post("/", fetchChat);
router.get("/", fetchChatRooms);
router.put("/remove", removeFromChatRoom);

module.exports = router;