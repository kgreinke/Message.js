const express = require('express');
const cors = require('cors');
const { createServer } = require('http');
const { join } = require('path');
const { Server } = require('socket.io');
const { MongoClient, ObjectId } = require('mongodb');
const { chats } = require("./data/data");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const colors = require("colors");
const mongoose = require('mongoose');
const userRoutes = require("../backend/routes/userRoutes");

const chatRoutes = require("../backend/routes/chatRoutes");
const messageRoutes = require('../backend/routes/messageRoutes');
const {notFound, errorHandler} = require("./middleware/errorMiddleware");

const app = express();
//const server = createServer(app);
//const io = new Server(server);

dotenv.config();
connectDB();
app.use(express.json()); //to accept JSON Data

app.get("/", (req, res) => {
    res.send("API is Running");
});

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

app.use(notFound)
app.use(errorHandler)





app.use(cors());
app.use(express.json());

const ATLAS_URI = "mongodb+srv://test:testing123@chatapptest.7pslh8a.mongodb.net/?retryWrites=true&w=majority&appName=ChatAppTest";

/*
const client = new MongoClient("mongodb+srv://test:testing123@chatapptest.7pslh8a.mongodb.net/?retryWrites=true&w=majority&appName=ChatAppTest");

let db, messageCollection, chatroomCollection;

async function initializeDB() {
    try {
        await client.connect();
        db = client.db("ChatApp");
        messageCollection = db.collection("Messages");
        chatroomCollection = db.collection("ChatRoom");
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error(err);
    }
}

initializeDB();
*/

const initDB = async () => {
    try {
        const connect = await mongoose.connect(process.env.ATLAS_URI,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }
        );

        console.log('MongoDB connected to: ${connect.connection.host}'.magenta);
    } catch (error) {
        console.error('Error: ${error.message}'.red.bold);
        process.exit();
    }
};

const port = process.env.PORT || 4000;
const server = app.listen(port, console.log(`Server running on port: ${port}...`.yellow.bold));
const io = new Server(server,
    {
        pingTimeout: 60000,
        cors: {
            origin: "https://localhost:3000"
        },
    }
);

app.get('/chats', async (req, res) => {
    try {
        const roomId = req.query.room;
        const result = await chatroomCollection.findOne({ "_id": new ObjectId(roomId) });
        if (!result) {
            res.status(404).send({ message: "Chat room not found" });
        } else {
            res.send(result);
        }
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

io.on('connection', (socket) => {
    console.log('A user connected'.green.bold);

    socket.on("setup", (userData) => {
        socket.join(userData._id);
        socket.emit("connected");
    });

    socket.on("join chatroom", (roomId) => {
        socket.join(roomId);
        console.log('User join chatroom: ${roomId}'.green);
    });

    socket.on("new message", (message) => {
        chatroom = message.roomId;

        if (!chatroom.users)
            return console.log("chatroom.users not defined".red);

        chatroom.users.forEach( (user) => {
            // if sender is user, do nothing
            if (user._id == message.sender.sender_id)
                return;

            socket.in(user._id).emit("message recieved", message);
        });
    });

    socket.off("setup", () => {
        console.log("user disconnected".yellow)
    })

    /*
    socket.on('join', async (roomId) => {
        try {
            if (roomId == "mongodb"){
                roomId = new ObjectId();
            }
            let result = await chatroomCollection.findOne( { "_id": roomId } );
            if (!result){
                await chatroomCollection.insertOne( { "_id": roomId, messages: [] } );
            }

            socket.join(roomId);
            socket.emit('joined', roomId);
        } catch (err) {
            console.log(err)
        }
    });
        

    socket.on('join', async (roomId) => {
        try {
            let room = await chatroomCollection.findOne({ "_id": new ObjectId(roomId) });
            if (!room) {
                await chatroomCollection.insertOne({ "_id": new ObjectId(roomId), messages: [] });
            }

            socket.join(roomId);
            socket.emit('joined', roomId);
            socket.activeRoom = roomId;
            console.log(`User joined room: ${roomId}`);
        } catch (err) {
            console.error(err);
        }
    });

    socket.on('new message', async (message) => {
        try {
            const roomId = socket.activeRoom;
            if (roomId) {
                await chatroomCollection.updateOne(
                    { "_id": new ObjectId(roomId) },
                    { "$push": { "messages": message } }
                );
                io.to(roomId).emit('new message', message);
                console.log(`New message in room ${roomId}: ${message}`);
            }
        } catch (err) {
            console.error(err);
        }
    });

    socket.on('new message', (message, room) => {    
        chatroomCollection.updateOne({ "_id": room }, {
            "$push": {
                "messages": message
            }
        });
//        io.to(socket.activeRoom).emit('new message', message);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected'.red.bold);
    });
*/
});

const PORT = process.env.PORT || 4000;

//app.listen(PORT, () => {
  //   console.log(`Server Started on PORT ${PORT}`, yellow.bold);
//});


