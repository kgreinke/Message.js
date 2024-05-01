require('dotenv').config()

const mongoose = require('mongoose');
const express = require('express');
const dbConnect = require('./config/dbConnection')
const ChatApp = express();
const ws = require('ws');
const jsonwebtoken = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const ChatRoom = require('./models/chatroom-model');
const Message = require('./models/message-model');
const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

const jsonSecret = process.env.jsonSecret;
const PORT = process.env.PORT || 5050;
console.log(process.env.NODE_ENV);
dbConnect();

ChatApp.use(express.json());
ChatApp.use(cookieParser());
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
const save = async(userFilePath, filename, bufferData) => {
    try {
        await fsPromises.writeFile(path.join(userFilePath, filename), bufferData);
    } catch(err) {
        console.log(err);
    }
};

// Socket Server Creation
const webSocketServer = new ws.WebSocketServer( { server } )
webSocketServer.on('connection', (connection, req)  => {
    console.log('Web Socket Server: Connection Aquired');

    // Log of all clients currently on web socket server
    const notifyUserLogInOut = () => {
        [...webSocketServer.clients].forEach(client => {
            client.send(JSON.stringify( {
                online: [...webSocketServer.clients].map(c => ({
                    userId: c.userId,
                    name: c.name
                }))
            }))
        })
    }

    connection.isAlive = true;

    // Check For User Timeout
    // If timeout: Terminate user connection 
    connection.timer = setInterval( () => {
        // Makes clients ping server on 5 second interval
        connection.ping()

        connection.deathTimer = setTimeout( () => {
            connection.isAlive = false;
            clearInterval(connection.timer);
            connection.terminate();
            notifyUserLogInOut();
            console.log("User Terminated");
        }, 1000)

    }, 5000)
    // Else: Do not terminate user connection
    connection.on('pong', () => {
        clearTimeout(connection.deathTimer)
    });


    // Retrieve cookie from specified connection
    // Decode for userId and name from cookie
    const cookie = req.headers.cookie;
    if(cookie) {
        const cookieToken = cookie.split(';').find(str => str.startsWith('token'));

        if(cookieToken) {
            const token = cookieToken.split('=')[1];

            if(token) {
                try{
                    jsonwebtoken.verify(token, jsonSecret, {}, (err, userData) => {
                        const { userId, name } = userData;
                        // Set attributes in connection
                        connection.userId = userId;
                        connection.name = name;
                    });
                } catch(err){
                    throw err;
                }
            }
        }
    }

    // Recieve Message From Client
    connection.on('message', async(message) => {
        const messageData = JSON.parse(message.toString());
        const { text, chatId } = messageData;

        if( text && chatId ) {
            // Send to DB
            const messageDocument = await Message.create({
                sender: connection.userId,
                chat_id: chatId,
                text: text
            });
        }
    });

    notifyUserLogInOut();
})



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