// controllers/chatController.js

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
    return res.sendStatus(400); // Bad request if userId is not provided
  }

  // Check if the chat between two users already exists
  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },   // Current user
      { users: { $elemMatch: { $eq: userId } } },         // Other user
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  // Populate sender details for the latest message
  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  // If chat exists, return the chat
  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    // If chat doesn't exist, create a new chat
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
    // Find all chats where the current user is a participant
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")               // Populate users field excluding passwords
      .populate("groupAdmin", "-password")          // Populate groupAdmin field excluding password
      .populate("latestMessage")                    // Populate lastMessage field
      .sort({ updatedAt: -1 })                      // Sort chats by last updated
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
  // Check if users and name are provided in the request body
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "Please Fill all the feilds" });
  }

  // Parse the users array from the request body
  var users = JSON.parse(req.body.users);

  // Ensure that there are at least two users to create a group chat
  if (users.length < 2) {
    return res
      .status(400)
      .send("More than 2 users are required to form a group chat");
  }

  // Add the current user to the list of users for the group chat
  users.push(req.user);

  // Create a new group chat
  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    // Populate user and groupAdmin fields (excluding passwords) in the created chat
    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")         // Populate users field excluding passwords
      .populate("groupAdmin", "-password");   // Populate groupAdmin field excluding password

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

  // Find chat by ID and update the chatName
  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName: chatName,                   // Set the new chat name
    },
    {
      new: true,                            // Return the updated document
    }
  )
    .populate("users", "-password")         // Populate users field excluding passwords
    .populate("groupAdmin", "-password");   // Populate groupAdmin field excluding password

  if (!updatedChat) {
    // If the chat is not found, send a 404 error response
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    // Send the updated chat details as the response
    res.json(updatedChat);
  }
});


// Route        PUT /api/chat/groupadd
// Access       Protected
// Description  Add user by userId to chat by chatId
const addToGroup = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;

    // Find chat by ID and add the user to the users array
    const added = await Chat.findByIdAndUpdate(
      chatId, 
      {
        $push: { users: userId },             // Add userId to the users array
      }, 
      { new : true }                          // Return the updated document
    )
      .populate("users", "-password")         // Populate users field excluding passwords
      .populate("groupAdmin", "-password");   // Populate groupAdmin field excluding password

    if(!added) {
      // If the chat is not found, send a 404 error response  
      res.status(404);
      throw new Error("Chat Not Found");
    } else {
      // Send the updated chat details as the response
      res.json(added);
    }
});


// Route        PUT /api/chat/remove
// Access       Protected
// Description  Remove one user by userId from chat by chatId
const removeFromGroup = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;

    // Find chat by ID and remove the user from the users array
    const removed = await Chat.findByIdAndUpdate(
      chatId, 
      {
        $pull: { users: userId },             // Remove userId from the users array
      }, 
      { new : true }                          // Return the updated document
    )
      .populate("users", "-password")         // Populate users field excluding passwords
      .populate("groupAdmin", "-password");   // Populate groupAdmin field excluding password

    if(!removed) {
      // If the chat is not found, send a 404 error response  
      res.status(404);
      throw new Error("Chat Not Found");
    } else {
      // Send the updated chat details as the response
      res.json(removed);
    }
});

// Export the controller functions
module.exports = { accessChat, fetchChats, createGroupChat, renameGroup, addToGroup, removeFromGroup};