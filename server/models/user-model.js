// models/user-model.js

const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    pic: { 
        type: String, 
        required: true, 
        default: 
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
  },
    { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;

/*
// To provide password hashing.
const bcrypt = require(bcrypt);
const SALT_WORK_FACTOR = 10;

// Maps to MongoDB 'user' collection.
const UserSchema = new mongoose.Schema( {
    // User id key
    // To be used in the chatroom and message collection.
    _id: { 
        type: ObjectId, 
        required: true, 
        index: { unique: true } // To ensure that _id is unique and not repeated.
    },
    // Display name of the user.
    name: { 
        type: String, 
        required: true, 
        index: { unique: true } // To ensure that name is unique and not repeated.
    },
    // User password.
    password: {
        type: String,
        required: true
    },
    // Primative array of chatroom schemas.
    chatrooms: {
        type: [mongoose.Schema.ChatRoomSchema],
        default: undefined
    }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
*/