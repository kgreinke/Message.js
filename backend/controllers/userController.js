const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, pic } = req.body;  

    if(!name || !email || !password) {
        res.status(400);
        throw new Error("Please Enter all the Feilds");
    }

    const userExists = await User.findOne({ email });

     if(userExists){
        res.status(400);
        throw new Error("User already exists");
     }


    const user = await User.create({
        name, 
        email, 
        password, 
        pic,
     })

    if(user){
        res.status(201).json({
            _id: user._id,
            name: user.name, 
            email: user.email,
                pic: user.pic,
            token:generateToken(user._id),
        })
    } else {
        res.status(400);
        throw new Error("Failed to Create the User");
    }
});

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid Email or Password");
  }
});


module.exports={ registerUser, authUser };








// User Controller

/*
const handler = require('express-async-handler');
const User = require('../models/user-model');
const generateToken = require('../utility/generateToken');
const colors = require('colors');


// Route:           GET /api/user?search=
// Access:          Public
// Description:     Get or search all users
const allUsers = handler (async (req, res) => {
    const regexSearch = new RegExp(req.query.search, "i");
    const query = req.query.search
        ? {
            $or: [
              { name: { $regex: regexSearch } },
              { email: { $regex: regexSearch } },
            ],
          }
        : {};
    
    const users = await User.find(query).find( { _id: { $ne: req.user._id } } );
    res.send(users);
});

// Route:           POST /api/users
// Access:          Public
// Description:     Create new user
const newUser = handler (async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password){
        res.status(400);
        console.log("Not all fields have been filled".yellow);
    }

    const result = await User.findOne( { email } );

    if (result){
        res.status(400);
        console.log("User already exists".yellow);
    }

    const user = await User.create(
        {
            name,
            email,
            password,
        }
    );

    if (user) {
        res.status(201).json(
            {
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
            }
        );
    }
    else {
        res.status(400);
        console.log("Failed to create user".red);
    }
});

// Route:           POST /api/users/login
// Access:          Public
// Description:     User password authentication
const passwordAuth = handler (async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne( { email } );

    if (!user) {
        res.status(400);
        console.log("User not found".yellow);
    }

    if (user && user.matchPassword(password)) {
        res.json(
            {
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id)
            }
        );
    }
    else {
        res.status(401);
        console.log("Invalid email or password".red)
    }
});

module.exports = { allUsers, newUser, passwordAuth };
*/