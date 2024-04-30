const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/', userController.getUsers);

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

// This will get a single user by id
router.get("/:id", async(req, res) => {
    let collection = await db.collection("users");
    let query = { _id: new ObjectId(req.params.id) };
    let result = await collection.findOne(query);

    if (!result) res.send("User not found").status(404);
    else res.send(result).status(200);
});

// This will create a new user.
router.post("/", async(req, res) => {
    try {
        let newUser = {
            name: req.body.name,
            password: req.body.password,
        };
        
        let collection = await db.collection("users");
        let result = await collection.insertOne(newUser);
        res.sendFile(result).status(204);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error creating user");
    }
});

// This section will update a user by id.
router.patch("/:id", async(req, res) => {
    try {       
        const query = { _id: new ObjectId(req.params.id) };
        const updates = {
            $set: {
                name: req.body.name,
                password: req.body.password,
            },
        };

        let collection = await db.collection("users");
        let result = await collection.updateOne(query, updates);
        res.send(result).status(200);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error updating user");        
    }
});

// This will delete a existing user
router.delete("/:id", async(req, res) => {
    try {
        const query = { _id: new ObjectId(req.params.id) };
        const collection = db.collection("users");
        let result = await collection.deleteOne(query);

        res.send(result).status(200);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error deleting user");        
    }
});

export default router;
*/