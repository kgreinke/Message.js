const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

// Route        POST /api/chat
// Access       Protected
// Description  Create or fetch chat
const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    console.log("UserId param not sent with request");
    return res.sendStatus(400);
  }

  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).json(FullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
});

// Route        GET /api/chat
// Access       Protected
// Description  Fetch all chats by user._id
const fetchChats = asyncHandler(async (req, res) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name pic email",
        });
        res.status(200).send(results);
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

// Route        POST /api/chat/group
// Access       Protected
// Description  Create a new group chat
const createGroupChat = asyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "Please Fill all the feilds" });
  }

  var users = JSON.parse(req.body.users);

  if (users.length < 2) {
    return res
      .status(400)
      .send("More than 2 users are required to form a group chat");
  }

  users.push(req.user);

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

// Route        PUT /api/chat/rename
// Access       Protected
// Description  Rename chatName by chatId
const renameGroup = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName: chatName,
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(updatedChat);
  }
});

// Route        PUT /api/chat/groupadd
// Access       Protected
// Description  Add user by userId to chat by chatId
const addToGroup = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;

    const added = await Chat.findByIdAndUpdate(
        chatId, 
        {
            $push: { users: userId },
        }, 
        { new : true }
    )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

    if(!added) {
        res.status(404);
        throw new Error("Chat Not Found");
    } else {
        res.json(added);
    }
});

// Route        PUT /api/chat/remove
// Access       Protected
// Description  Remove one user by userId from chat by chatId
const removeFromGroup = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;

    const removed = await Chat.findByIdAndUpdate(
        chatId, 
        {
            $pull: { users: userId },
        }, 
        { new : true }
    )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

    if(!removed) {
        res.status(404);
        throw new Error("Chat Not Found");
    } else {
        res.json(removed);
    }
});

module.exports = { accessChat, fetchChats, createGroupChat, renameGroup, addToGroup, removeFromGroup};















































/*
// Chatroom Controller

const handler = require('express-async-handler');
const ChatRoom = require('../models/chatroom-model');
const User = require('../models/userModel');
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
*/