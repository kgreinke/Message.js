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
    // Chatroom id key
    _id: {
        type: ObjectId,
        required: true
    },
    // Name of the chat room.
    name: { 
        type: String,
        required: true
    },
    // Array of users id's.    
    members: [
        {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'user'
        }
    ],
    // Primitive array of messages.
    messages: {
        type: [mongoose.Schema.MessageSchema],
        default: undefined
    }
});

const ChatRoom = mongoose.model('ChatRoom', ChatRoomSchema);

module.exports = ChatRoom;
