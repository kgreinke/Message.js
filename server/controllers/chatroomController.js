const ChatRoom = require('../models/chatroom-model');
const User = require('../models/user-model');
const Message = require('../models/message-model')
const jsonToken  = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

// Get Chatrooms Middleware
// Route: GET /:user_id
// Access: Need Authentication
const getAllChats = asyncHandler( async(res, req, next) => {
    try {
        ChatRoom.find( { members: { $elemMatch: { $eq: req.user._id } } })
            .populate("members", "-password")
            .populate("messages")
            .sort( { updatedAt: -1 } )
            .then( async(results) => {
                results = await User.populate(results, {
                    path: "messages",
                });
                res.status(200).send(results);
            });

    } catch(err){
        res.status(400);
        console.log(err.message);
    }
});

// Create Chatroom
// Route: POST /api/chatroom
// Access: Need Authentication
const createChatroom = asyncHandler( async(req, res) => {
    if(!req.body.members || !req.body.name){
        return res.status(400).send({
            message: "Please Fill All Fields"
        });
    }

    var members = JSON.parse(req.body.users);

    if(members.length < 1){
        return res.status(400).send({
            message: "You Must Add More Than Just Yourself"
        });
    }

    members.push(req.user)

    try {
        const chat = await ChatRoom.create( {
            name: req.body.name,
            members: members,
        });

        const populatedChat = await ChatRoom.findOne( { _id: chat._id } )
            .populate("members", "-password");
        
        res.status(200).json(populatedChat);
    } catch(err) {
        res.status(400).send(err.message);
    }
});

module.exports = {
    getAllChats,
    createChatroom,
};