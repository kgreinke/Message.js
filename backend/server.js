const express = require('express');
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require("../backend/routes/userRoutes");
const chatRoutes = require("../backend/routes/chatRoutes");
const messageRoutes = require('../backend/routes/messageRoutes');
const {notFound, errorHandler} = require("./middleware/errorMiddleware");
const cors = require('cors');
const colors = require("colors");




dotenv.config();
connectDB();
const app = express();

app.use(express.json()); //to accept JSON Data

/*
app.get("/", (req, res) => {
    res.send("API is Running");
});
*/

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

app.use(notFound);
app.use(errorHandler);

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 4000;
const server = app.listen(port, console.log(`Server running on port: ${port}`.yellow.bold));

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});



io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chatroom", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });
  
  socket.on("new message", (newMessageRecieved) => {
        var chat = newMessageRecieved.chat;
        if (!chat.users) return console.log("chat.users not defined!!");
        chat.users.forEach((user) => {
          if (user._id == newMessageRecieved.sender._id) return;
          socket.in(user._id).emit("message received", newMessageRecieved);
        });
    });
/*
    socket.on("typing", (chat) => {
        socket.in(chat).emit("typing...");
    });

    socket.on("stopped typing", (chat) => {
        socket.in(chat).emit("stopped typing...");
    });

    

    socket.off("setup", () => {
        console.log("user disconnected".yellow);
        socket.leave(userData._id);
    });
    */
});

const PORT = process.env.PORT || 4000;