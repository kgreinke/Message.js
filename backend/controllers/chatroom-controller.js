// Chatroom Controller

const handler = require('express-async-handler');
const ChatRoom = require('../models/chatroom-model');
const User = require('../models/user-model');
const colors = require('colors');

// Route:           POST /api/chatroom
// Access:          Protected
// Description:     Create or fetch chatroom
const fetchChat = handler( async (req, res) => {
    const { userId, chatName } = req.body;

    let chatMembers = JSON.parse(req.body.chatMembers);

    if (!userId) {
        console.log("User id not in request, request failed".red);
        return res.sendStatus(400);
    }

    if (!chatName) {
        console.log("Chat name not in request, request failed".red);
        return res.sendStatus(400);
    }

    let chat = await ChatRoom.find({
        $and: [
            { members: { $elemMatch: { $eq: req.user._id } } },
            { members: { $elemMatch: { $eq: userId } } },
        ],
    }).populate("members", "-password")
      .populate("lastMessage");

    chat = await User.populate(chat, {
        path: "lastMessage.sender",
        select: "name",
    });

    if (chat.length > 0) {
        res.send(chat[0]);
    }
    else {
        var chatData = {
            chatName: chatName,
            members: chatMembers,
        };
        
        try {    
            const createdChat = await ChatRoom.create(chatData);
            const fillChat = await ChatRoom.findOne( { _id: createdChat._id }
                .populate("members", "-password")
            );
            res.status(200).send(fillChat);
            console.log("Chatroom creation successful".green);
        } catch (error) {
            res.status(400);
            console.log("Failure to create chatroom".red);
        }
    }
});

// Route:           GET /api/chatroom
// Access:          Protected
// Description:     Fetch all chatrooms a user is in
const fetchChatrooms = handler (async (req, res) => {
    try {
        ChatRoom.find(
            {
                members: { $elemMatch: { $eq: req.user._id } }
            })
            .populate("members", "-password")
            .populate("lastMessage")
            .sort({ updatedAt: -1 })
            .then( async (result) => {
                result = await User.populate(result, {
                    path: "lastMessage.sender",
                    select: "name",
                });
            });
    } catch (error) {
        res.status(400);
        console.log("Failure to fetch chatrooms".red);
    }
});

// Route:           PUT /api/chatroom/remove
// Access:          Protected
// Description:     Remove member from chatroom
const removeFromChatRoom = handler ( async (req, res) => {
    const { roomId, userId } = req.body;
    
    const result = await ChatRoom.findByIdAndUpdate(roomId, 
        { $pull: { members: userId } },
        { new: true },
    )
        .populate("members", "-password");
    
    if (!result){
        res.status(400);
        console.log("Failure to remove user from chatroom".red);
    }
    else
        res.json(result);
});

module.exports = { fetchChat, fetchChatrooms, removeFromChatRoom };