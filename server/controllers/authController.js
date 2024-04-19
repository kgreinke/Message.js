import db from "../db/connection.js";
const User = require('../models/user-model.js');
const bcryptjs = require('bcryptjs');
const jsonToken = require('jsonwebtoken');
const { errorHandler } = require('../utils/errorHandler')

// Signup middleware
// Route: POST /signup
// Access: Public
const signUP = async(req, res, next) => {
    try {
        const { username, password } = req.body;

        if (!username || !password){
            res.status(400).json('All Fields Are Required For Signup!')
        }

        // Check for duplicate.
        const duplicate = await User.findOne( { name: username } )
            .collection( { locale: 'en', strength: 2 } )
            .lean().exec();

        if (duplicate) {
            return res.status(409).json( { message: 'Duplicate Username! Try Another?' } )
        }

        // Hash Password.
        const hashedPassword = bcryptjs.hashSync(password, 10);
        
        // Make new user.
        const newUser = new User( {
            name: username,
            password: hashedPassword,
        });

        // Attempt inserting new user.
        try{
            await newUser.save()
            res.staus(201).json('User Created Sucessfully!')
        } catch (err){
            next(err);
        }

    } catch (err) {
        console.error(err);
        res.status(500).send("Error Creating User");
    }
};

// Sign In Middleware
// Route: POST /sign-in
// Access: Public
const signIn = async(req, res, next) => {
    const { username, password } = req.body;

    try {
        const validateUser = await User.findOne({ name: username });
        if (!validateUser) {
            return next(errorHandler(404, 'Wrong Username or User Not Found..'));
        }

        const validatePassword = bcryptjs.compareSync(password, validateUser.password);
        if (!validatePassword) {
            return next(errorHandler(401, 'Wrong Password!'));
        }

        // Create JSON Web Token
        const token = jsonToken.sign( 
            {
                userId: validateUser._id,
                username: validateUser.username
            },
            process.env.jsonToken_SECREATE
        )

        res.cookie('token', token)
            .status(200)
            .json(rest)
    } catch(err) {
        next(err)
    }
};

// User Sign Out Middleware
// Route: GET /sign-out
// Access: Public
const signOut = async(req, res, next) => {
    try{
        res.cookie('token', '');
        res.status(200).json('User has been logged out.');
    } catch(err) {
        next(err);
    }
};

module.exports = {
    signUp,
    signIn,
    signOut,
};