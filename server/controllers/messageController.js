const Message = require('../models/message-model.js');
const jsonToken = require('jsonwebtoken');

// Get Messages Middleware
// Route: GET /:chat_id
// Access: Need authentication
const getMessages = async(req, res, next) => {
    try{
        const { chat_id } =  req.params;        // Sellected chat's id
        const userData = req.userData;          // User data of current user
        const our_chat_id = userData.user_id

        const messages = await Message.find( {
            chat_id: { $in: [user_id]}
        })
    }
}