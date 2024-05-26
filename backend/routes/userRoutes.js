const express = require('express');
const { registerUser, authUser } = require('../controllers/userController');
//const { allUsers, newUser, passwordAuth } = require('../controllers/user-controller');
//router.route("/").get(allUsers);
//router.route("/").post(newUser);
//router.post("/login", passwordAuth);
//module.exports = router;

const router = express.Router();

router.route('/').post(registerUser)
router.post('/login', authUser )

module.exports = router;