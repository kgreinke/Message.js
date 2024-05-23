// models/chatroom-model.js

const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');


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