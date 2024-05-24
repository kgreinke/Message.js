// models/chatroom-model.js
const { ObjectId, Timestamp } = require('mongodb');
const mongoose = require('mongoose');

<<<<<<< HEAD
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
=======
>>>>>>> de53cb0d80d8f45950310fbaa1e2602a86f66437

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

<<<<<<< HEAD
module.exports = ChatRoom;
=======
module.exports = ChatRoom; 
>>>>>>> de53cb0d80d8f45950310fbaa1e2602a86f66437
