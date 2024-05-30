// models/message-model.js

const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
// Maps tp MongoDB 'message' collection.

const MessageSchema = mongoose.Schema( {
// Text message sent.
    text: { 
        type: String, 
        trim: true ,
    },
    // Sender data.
    sender: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
    },
    // Id of chatroom.
    roomId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat',
    },
    },
    // Timestamps of message.
    { timestamps: true }
);

const Message = mongoose.model('Message', MessageSchema);

module.exports = Message;
