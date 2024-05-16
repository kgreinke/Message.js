const express = require('express');
const cors = require('cors');
const { createServer } = require('http');
const { join } = require('path');
const { Server } = require('socket.io');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(cors());
app.use(express.json());

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
    console.log('A user connected');

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
            socket.activeRoom = roomId;
        } catch (err) {
            console.log(err)
        }
    });
        
/*
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
*/
    socket.on('new message', (message) => {
        chatroomCollection.updateOne({ "_id": socket.activeRoom }, {
            "$push": {
                "messages": message
            }
        });
        io.to(socket.activeRoom).emit('new message', message);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
