// models/user-model.js

const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

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


// For the perpose of password hashing.
UserSchema.pre(save, function(next) {
    const user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });

});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

//Example of how to use:
/*
// fetch user and test password verification
User.findOne({ username: 'jmar777' }, function(err, user) {
    if (err) throw err;

    // test a matching password
    user.comparePassword('Password123', function(err, isMatch) {
        if (err) throw err;
        console.log('Password123:', isMatch); // -> Password123: true
    });

    // test a failing password
    user.comparePassword('123Password', function(err, isMatch) {
        if (err) throw err;
        console.log('123Password:', isMatch); // -> 123Password: false
    });
});
*/

const User = mongoose.model('User', UserSchema);

module.exports = User;