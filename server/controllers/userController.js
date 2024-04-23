const User = require('../models/user');

// Get User Middleware
// Route: GET /
// Access: Public
const getUsers = async(req, res, next) => {
    try {
        const users = await User.find( {} );
        return res.status(200).json(users);
    } catch(err) {
        next(err);
    }
};

module.exports = getUsers;