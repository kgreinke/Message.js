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