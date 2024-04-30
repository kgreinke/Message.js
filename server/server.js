require('dotenv').config()

const mongoose = require('mongoose');
const express = require('express');
const dbConnect = require('./config/dbConnection')
const ChatApp = express();
const ws = require('ws');
const jsonwebtoken = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const ChatRoom = require('./models/chatroom-model')
const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

const jsonSecret = process.env.jsonSecret;
const PORT = process.env.PORT || 5050;
console.log(process.env.NODE_ENV);
dbConnect();

ChatApp.use(express.json());
ChatApp.use(cookieParser());
ChatApp.use('/api/uploads'. express.static(__dirname + '/uploads'));
ChatApp.use('/chatApp/v1/auth', require('./routes/auth'));
ChatApp.use('/chatApp/v1/chatrooms', require('./routes/chatrooms'));
ChatApp.use('/chatApp/v1/messages', require('./routes/messages'));
ChatApp.use('/chatApp/v1/users', require('./routes/users'));

// Make default error handler middleware
ChatApp.use( (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Unknown Internal Server Error';

    return res.status(statusCode).json( {
        text: 'default error handler',
        success: false,
        statusCode,
        message,
    })
});

// Database Connections
mongoose.connetion.once('open', () => {
    console.log("Connected to MongoDB")
});

mongoose.connection.on('error', err => {
    console.log(err)
});


// Local Server Hosting
let server = ChatApp.listen(PORT, () => {
    console.log('Server running on port: ${PORT}')
});


// File Uploading

/*
import express from "express";
import cors from "cors";
import users from "./routes/users.js";
import chatrooms from "./routes/chatrooms.js";
import messages from "./routes/messages.js";

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());
app.use("/users", users);
app.use("/chatrooms", chatrooms);
app.use("/messages", messages);

// start Express.js server
app.listen(PORT, () => {
    console.log('Server listening on port ${PORT}');
});
*/