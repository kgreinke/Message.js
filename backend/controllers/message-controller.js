// Message Controller

const handler = require('express-async-handler');
const Message = require('../models/message-model');
const User = require('../models/userModel');
const Chat = require('../models/chatModel');

// Route:       GET /api/message/:roomId
// Access:      Protected
// Description  Get all messages for a requested chatroom
const allMessages = handler( async (req, res) => {
    const { chat_id } = req.params;
    try{
        let messages = await Message.find({ chat_id })
            .populate({
                path: 'sender',
                model: 'User',
                select: 'name pic email',
            })
            .populate({
                path: 'roomId',
                model: 'Chat',
            })
            .sort({ updatedAt: -1 });
        res.status(200).send(messages);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

// Route:       POST /api/message
// Access:      Protected
// Description: Create new message
const sendMessage = handler(async (req, res) => {
    const { text, sender, roomId } = req.body;

    if (!text || !roomId) {
        console.log("invalid data passed into request: sendMessage")
        return res.sendStatus(400);
    }

    let message = new Message({
        text,
        sender,
        roomId,
    });

    try {
        var newMessage = await Message.create(message);

        newMessage = await newMessage.populate("sender", "name pic");
        newMessage = await newMessage.populate("roomId");
        newMessage = await User.populate(newMessage, {
            path: "chat.users",
            select: "name pic email"
        });

        await Chat.findByIdAndUpdate(req.body.roomId, { lastMessage: newMessage });

        res.json(newMessage);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

module.exports = { allMessages, sendMessage };