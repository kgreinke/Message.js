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

    socket.on("join chatroom", (chatId) => {
        socket.join(chatId);
        console.log("User joined chatroom: ".green + chatId);
    });

    socket.on("typing", (chat) => {
        socket.in(chat).emit("typing...");
    });

    socket.on("stopped typing", (chat) => {
        socket.in(chat).emit("stopped typing...");
    });

    // Socket method for instant messaging.
    // When front end emits "new message"
    // Backend catches it, and then emits it
    // in the associated chat.
    // To catch in front end:
    // socket.on("message receieved", (message) => {...}
    socket.on("new message", (newMessage) => {
        let chat = newMessage.chat;
        if (!chat.users) return console.log("chat.users not found !!");
        chat.users.forEach((user) => {
          if (user._id == newMessage.sender._id) return;
          socket.in(user._id).emit("message received", newMessage);
        });
    });

    socket.off("setup", () => {
        console.log("user disconnected".yellow);
        socket.leave(userData._id);
    });
});

const PORT = process.env.PORT || 4000;