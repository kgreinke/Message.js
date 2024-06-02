// Message Controller

const handler = require('express-async-handler');
const Message = require('../models/message-model');
const User = require('../models/userModel');
const Chat = require('../models/chatModel');

// Route:       GET /api/message/:chat
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
                path: 'chat',
                model: 'Chat',
            });
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
    const { text, chatId } = req.body;

    if (!text || !chatId) {
        console.log("invalid data passed into request: sendMessage")
        return res.sendStatus(400);
    }

    let message = new Message({
        text: text,
        sender:req.user._id,
        chat: chatId,
    });

    try {
        var newMessage = await Message.create(message);

        newMessage = await newMessage.populate("sender", "name pic");
        newMessage = await newMessage.populate("chat");
        newMessage = await User.populate(newMessage, {
            path: "chat.users",
            select: "name pic email"
        });

        await Chat.findByIdAndUpdate(req.body.chat, { lastMessage: newMessage });

        res.json(newMessage);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

module.exports = { allMessages, sendMessage };