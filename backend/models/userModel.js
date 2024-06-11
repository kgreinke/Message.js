// models/userModel.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Maps tp MongoDB 'user' collection.
const userSchema = mongoose.Schema(
  {
    // User's name
    name: { 
      type: "String", 
      required: true 
    },
    // User's email (unique and required)
    email: { 
      type: "String", 
      unique: true, 
      required: true 
    },
    // User's password (hashed)
    password: { 
      type: "String", 
      required: true 
    },
    // User's profile picture URL (default if not provided)
    pic: {
      type: "String",
      required: true,
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
    // Flag to indicate if the user is an admin (default: false)
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestaps: true } // Automatically manage createdAt and updatedAt fields
);

// Method to compare entered password with hashed password in the database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Pre-save middleware to hash the password before saving the user document
userSchema.pre("save", async function (next) {
  // If password is not modified, move to the next middleware
  if (!this.isModified) {
    next();
  }

  // Generate salt and hash the password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Create and export the User model
const User = mongoose.model("User", userSchema);
module.exports = User;