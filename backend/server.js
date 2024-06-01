const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const colors = require("colors");

const userRoutes = require("../backend/routes/userRoutes");
const chatRoutes = require("../backend/routes/chatRoutes");
const messageRoutes = require('../backend/routes/messageRoutes');

const {notFound, errorHandler} = require("./middleware/errorMiddleware");

const app = express();

dotenv.config();
connectDB();
app.use(express.json()); //to accept JSON Data

app.get("/", (req, res) => {
    res.send("API is Running");
});

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

app.use(notFound);
app.use(errorHandler);

app.use(cors());
app.use(express.json());

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



io.on('connection', (socket) => {
    console.log('A user connected'.green.bold);

    socket.on("setup", (userData) => {
        socket.join(userData._id);
        socket.emit("connected");
    });

    socket.on("join chatroom", (roomId) => {
        socket.join(roomId);
        console.log("User joined chatroom: ".green + roomId);
    });

    socket.on("typing", (roomId) => {
        socket.in(roomId).emit("typing...");
    });

    socket.on("stopped typing", (roomId) => {
        socket.in(roomId).emit("stopped typing...");
    });

    // Socket method for instant messaging.
    // When front end emits "new message"
    // Backend catches it, and then emits it
    // in the associated roomId.
    // To catch in front end:
    // socket.on("message receieved", (message) => {...}
    socket.on("new message", (newMessage) => {
        chatroom = newMessage.roomId;

        if (!chatroom.users)
            return console.log("chatroom.users not defined".red);

        chatroom.users.forEach( (user) => {
            // if sender is user, do nothing
            if (user._id == message.sender._id)
                return;

            socket.in(user._id).emit("message recieved", message);
        });
    });

    socket.off("setup", () => {
        console.log("user disconnected".yellow);
        socket.leave(userData._id);
    });
});

const PORT = process.env.PORT || 4000;