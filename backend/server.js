// server.js

const express = require('express');
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require("../backend/routes/userRoutes");
const chatRoutes = require("../backend/routes/chatRoutes");
const messageRoutes = require('../backend/routes/messageRoutes');
const {notFound, errorHandler} = require("./middleware/errorMiddleware");
const cors = require('cors');
const colors = require("colors");
const path = require("path");

// Load environment variables from a .env file into process.env
dotenv.config();

// Connect to the MongoDB database
connectDB();

// Create an instance of an Express application
const app = express();

// Middleware to parse JSON bodies in requests
app.use(express.json());

/*
app.get("/", (req, res) => {
    res.send("API is Running");
});
*/

// Define API routes for user, chat, and message functionalities
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);


//*************Deployment************ */

// Resolve the current directory path
const __dirname1 = path.resolve();

// Serve static files from the React frontend app in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/frontend/build")));

  // Handle any requests that don't match the API routes
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))
  );
} else {
  // For development, send a simple message
  app.get("/", (req, res) => {
    res.send("API is running..");
  });
}

//*************Deployment************ */

// Custom middleware to handle 404 errors (resource not found)
app.use(notFound);

// Custom error handling middleware
app.use(errorHandler);

// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors());
//app.use(express.json());

// Set the port for the server to listen on, default to 4000 if not specified in environment
const port = process.env.PORT || 4000;

// Start the server and log the port number
const server = app.listen(port, console.log(`Server running on port: ${port}`.yellow.bold));


/* ************************************************************************************* */
// * * * * * * * * * * * * * * * * * * SOCKET SETUP * * * * * * * * * * * * * * * * * * *//
// Use this for local hosting, just make sure to swap what is used in SingleChat.js.

// Initialize Socket.io for real-time communication
/*
const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});
*/

// Use this for render deployment

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "https://message-js.onrender.com/",
  },
});

/* ************************************************************************************* */


// Handle various socket events
io.on("connection", (socket) => {
  console.log("Connected to socket.io");

  // Setup event when a user connects
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  // Event for joining a chatroom
  socket.on("join chatroom", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });
  
  // Event for receiving a new message
  socket.on("new message", (newMessageRecieved) => {
        var chat = newMessageRecieved.chat;
        if (!chat.users) return console.log("chat.users not defined!!");
        
        // Broadcast the new message to all users in the chat except the sender
        chat.users.forEach((user) => {
          if (user._id == newMessageRecieved.sender._id) return;
          socket.in(user._id).emit("message received", newMessageRecieved);
        });
    });
    
    // Event for indicating that a user is typing
    socket.on("typing", (room) => {
        socket.in(room).emit("typing");
    });

    // Event for indicating that a user stopped typing
    socket.on("stop typing", (room) => {
        socket.in(room).emit("stop typing");
    });

    // Setup event when a user connects (duplicate)
    socket.on("setup", (userData) => {
        console.log("user connected".green);
        socket.join(userData._id);
        socket.emit("connected")
    });
    
});

const PORT = process.env.PORT || 4000;