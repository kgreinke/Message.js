// models/message-model.js

const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

// Maps tp MongoDB 'message' collection.
const MessageSchema = new mongoose.Schema( {
// Text message sent.
    text: { 
        type: String, 
        trim: true ,
    },
    // Sender data.
    sender: {
        // User name of sender.
        sender_name: { 
            type: String,
        },
        // _id of sender.
        sender_id: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Users' ,
        }
    },
    // Id of chatroom.
    roomId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ChatRoom',
    },
    },
    // Timestamps of message.
    { timestamps: true }
);

const Message = mongoose.model('Message', MessageSchema);

module.exports = Message;