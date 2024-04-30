const express = require('express');
const router = express.Router();
const validateUserToken = require('../utils/validateUserToken');
const chatroomController = require('../controllers/chatroomController');

router.get('/:userId', validateUserToken, chatroomController.getChatrooms);

module.exports = router;


/*
import express from "express";

// To help connect to database.
import db from "../db/connection.js";

// To help convert id from string to ObjectId for the _id.
import { ObjectId } from "mongodb";


// Router is an instance of the express router.
// Used to define routes.
// Router will be added as a 'middleware' and will take control
// of the resquests starting with path /record.
const router = express.Router();


// This will get a single chat room by id.
router.get("/:id", async(req, res) => {
    let collection = await db.collection("chatroom");
    let query = { _id: new ObjectId(req.params.id) };
    let result = await collection.findOne(query);

    if ( !result ) res.send("Chat room not found").status(404);
    else res.send(result).status(200);
});

// This will create a new chat room.
router.post("/", async(req, res) => {
    try {
        let newChatroom = {
                name: req.body.name,
                members: req.body.members,
        };

        let collection = await db.collection("chatroom");
        let result = await collection.insertOne(newChatroom);
        res.sendFile(result).status(204);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error Creating Chat Room");
    }
});
*/