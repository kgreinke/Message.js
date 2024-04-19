const ChatRoom = require('../models/chatroom-model.js');
const jsonToken  = require('jsonwebtoken');

// Get Chatrooms Middleware
// Route: GET /:user_id
// Access: Need Authentication
const getChatrooms = async(res, req, next) => {
    try {
        const { user_id } = req.params  // selectedChatId
        const userData = req.userData   // userData of current logged in user
        const ourUser_Id = userData.user_id;

        const rooms = await ChatRoom.find( {
            members: { $in: [user_id, ourUser_Id] }
        }).sort( { createdAt: 1 } );

        res.json(rooms);

    } catch(err) {
        next(err);
    }
}

module.exports = getChatrooms;