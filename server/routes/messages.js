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
