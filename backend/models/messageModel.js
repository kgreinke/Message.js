// models/message-model.js
const mongoose = require("mongoose");

// Maps tp MongoDB 'message' collection.
const messageSchema = mongoose.Schema(
  {
    // Reference to the sender of the message (references User model)
    sender: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User" 
    },
    // Content of the message
    content: { 
      type: String, 
      trim: true 
    },
    // Reference to the chat this message belongs to (references Chat model)
    chat: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Chat" 
    },
    // RELATIVELY UNUSED - Users who have read the message (references User model)
    readBy: [
      { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User" 
      }
    ],
  },
  { timestamps: true } // Automatically manage createdAt and updatedAt fields
);

// Create and export the Message model
const Message = mongoose.model("Message", messageSchema);
module.exports = Message;