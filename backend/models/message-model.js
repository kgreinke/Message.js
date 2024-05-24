// models/message-model.js

const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const messageModel = mongoose.Schema (
    {
        sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        content: { type: String, trim: true },
        chat: {type: mongoose.Schema.Types.ObjectId, ref: "Chat"},
    },
    {
        timestamps: true,
    }
);

//const Message = mongoose.model("Message", messageModel);

//module.exports = Message;


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
