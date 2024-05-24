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
const bcrypt = require("bcryptjs");
const SALT_WORK_FACTOR = 10;

// Maps to MongoDB 'user' collection.
const UserSchema = new mongoose.Schema( {
    // Display name of the user.
    name: { 
        type: String, 
        required: true,
    },
    // User email for auth
    email: {
        type: String,
        unique: true,
        required: true,
    },
    // User password.
    password: {
        type: String,
        required: true,
    },
    // Primative array of chatroom schemas.
    chatrooms: {
        type: [mongoose.Schema.ChatRoomSchema],
        default: undefined,
    },
    },
    { timestamps: true }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
    if (!this.isModified) {
      next();
    }
  
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
*/