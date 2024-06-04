const mongoose = require("mongoose");

const messageSchema = mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: { type: String, trim: true },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;


/*
// models/message-model.js

const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const Chat = require('./chatModel');
// Maps tp MongoDB 'message' collection.

const MessageSchema = mongoose.Schema( {
// Text message sent.
    text: { 
        type: String, 
        trim: true,
    },
    // Sender data.
    sender: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
    },
    // Id of chatroom.
    chat: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat',
    },
    },
    // Timestamps of message.
    { timestamps: true }
);

const Message = mongoose.model('Message', MessageSchema);

module.exports = Message;

*/