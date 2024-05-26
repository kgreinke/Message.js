// models/chatroom-model.js
const { ObjectId, Timestamp } = require('mongodb');
const mongoose = require('mongoose');

const chatModel = mongoose.Schema(
    {
        chatName: { type: String, trim: true},
        isGroupChat: {type: Boolean, default: false},
        users: [
            {
                type: mongoose.Schema.Types.ObjectId, 
                ref: "User",
            },
        ],
        latestMessage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message",
        },
        groupAdmin: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: "User",

        },
    },
    {
        timestamp: true,
    }
);

const Chat = mongoose.model("Chat", chatModel);

module.exports = Chat;

// chatName
// isGroupChat
// users
// latestMessage
// groupAdmin

// Maps to MongoDB 'chatroom' collection.

const ChatRoomSchema = new mongoose.Schema( {
// Name of the chat room.
    chatName: { 
        type: String,
        required: true,
    },
    // Array of users id's.    
    members: [
        {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User',
        }
    ],
    // Primitive array of messages.
    lastMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    },
    },
    { timestamps: true }
);

const ChatRoom = mongoose.model('ChatRoom', ChatRoomSchema);

module.exports = ChatRoom;
