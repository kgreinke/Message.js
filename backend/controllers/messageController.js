// controllers/messageController.js

const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");

// Route        GET /api/message/:chatId
// Access       Protected
// Description  Get all messages for a specific chat by chatId
const allMessages = asyncHandler(async (req, res) => {
  try {
    // Find all messages in the specified chat and populate sender and chat details
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")   // Populate sender details (name, pic, email)
      .populate("chat");                      // Populate chat details
    
    // Send the found messages as the response
    res.json(messages);
  } catch (error) {
    // Handle any errors that occur during the message retrieval
    res.status(400);
    throw new Error(error.message);
  }
});


// Route        POST /api/message
// Access       Protected
// Description  Send a new message in a specific chat
const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  // Check if content and chatId are provided in the request body
  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  // Create a new message object with the sender, content, and chat
  var newMessage = {
    sender: req.user._id,   // Set the sender as the current user
    content: content,       // Set the message content
    chat: chatId,           // Set the chat ID
  };

  try {
    // Create a new message in the databas
    var message = await Message.create(newMessage);

    message = await message.populate("sender", "name pic");   // Populate the sender details
    message = await message.populate("chat");                 // Populate the chat details
    message = await User.populate(message, {                  // Populate the user details
      path: "chat.users",
      select: "name pic email",
    });

    // Update the latest message in the chat
    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

    // Send the created message as the response
    res.json(message);
  } catch (error) {
    // Handle any errors that occur during the message creation
    res.status(400);
    throw new Error(error.message);
  }
});

// Export the controller functions
module.exports = { allMessages, sendMessage };