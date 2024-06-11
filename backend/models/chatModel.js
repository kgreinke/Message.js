// models/chatModel.js
const mongoose = require("mongoose");

// Maps tp MongoDB 'chatroom' collection.
const chatModel = mongoose.Schema(
  {
    // Name of the chat
    chatName: { 
      type: String, 
      trim: true 
    },
    // Flag to indicate if the chat is a group chat
    isGroupChat: { 
      type: Boolean, 
      default: false 
    },
    // Users participating in the chat (references User model)
    users: [
      { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User" 
      }
    ],
    // Reference to the latest message in the chat (references Message model)
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    // Reference to the group admin (references User model)
    groupAdmin: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User" 
    },
  },
  { timestamps: true } // Automatically manage createdAt and updatedAt fields
);

// Create and export the Chat model
const Chat = mongoose.model("Chat", chatModel);
module.exports = Chat;