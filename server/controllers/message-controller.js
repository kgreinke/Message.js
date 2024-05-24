// Message Controller

const handler = require('express-async-handler');
const Message = require('../models/message-model');
const ChatRoom = require('../models/chatroom-model');
const User = require('../models/user-model');

// Route:       GET /api/messages/:roomId
// Access:      Protected
// Description  Get all messages for a requested chatroom
const allMessages = handler( async (req, res) => {
    try{
        const messages = await Message.find({ roomId: req.params.roomId })
            .populate("sender", "name")
            .populate("roomId");
        res.json(messages);
    } catch (error) {
        res.status(400);
        console.log(error.message)
    }
});

// Route:       POST /api/message
// Access:      Protected
// Description: Create new message
const sendMessage = handler(async (req, res) => {
    const { text, roomId } = req.body;

    if (!text || !roomId) {
        console.log("invalid data passed into request: sendMessage")
        return res.sendStatus(400);
    }

    var message = {
        sender: req.user._id,
        text: text,
        roomId: roomId,
    };

    try {
        var newMessage = await Message.create(message);

        newMessage = await newMessage.populate("sender", "name").execPopulate();
        newMessage = await newMessage.populate("roomId").execPopulate();
        newMessage = await User.populate(newMessage, {
            path: "chatroom.user",
            select: "name"
        });

        await ChatRoom.findByIdAndUpdate(req.body.roomId, { lastMessage: newMessage });

        res.json(newMessage);
    } catch (error) {
        res.status(400);
        console.log(error.message);
    }
});

module.exports = { allMessages, sendMessage };