// models/message-model.js

const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

// Maps tp MongoDB 'message' collection.
const MessageSchema = new mongoose.Schema( {
    // Message id key
    // To be used in the chatroom collection.
    _id: { 
        type: ObjectId, 
        required: true 
    },
    // Text message sent.
    text: { 
        type: String, 
        required: true 
    },
    sender: {
        // User name of sender.
        sender_name: { 
            type: String, 
            required: true 
        },
        // _id of sender.
        sender_id: { 
            type: Schema.ObjectId, 
            required: true 
        }
    },
    chat_id: { type: Schema.ObjectId },
    timestamps: {
        // Dev Note:
        // The createdAt property is immutable, and Mongoose overwrites any 
        // user-specified updates to updatedAt by default.
        createdAt: 'created_at', // Use 'created_at' to store the created date.
        updatedAt: 'updated_at'  // use 'updated_at' to store the last updated date.
    }
});

const Message = mongoose.model('Message', MessageSchema);

module.exports = Message;