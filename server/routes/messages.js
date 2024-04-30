const express = require('express');
const router = express.Router();
const validateUserToken = require('../utils/validateUserToken');
const messageController = require('../controllers/messageController');

router.get('/:userId', validateUserToken, messageController.getMessages);

module.exports = router;