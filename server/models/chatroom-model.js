// models/chatroom-model.js

const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

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