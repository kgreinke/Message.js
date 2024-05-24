// User Routes

const express = require('express');
const { allUsers, newUser, passwordAuth } = require('../controllers/user-controller');

const router = express.Router();

router.route("/").get(allUsers);
router.route("/").post(newUser);
router.post("/login", passwordAuth);

module.exports = router;