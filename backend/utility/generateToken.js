// POSSIBLY UNUSED REDUNDANT METHOD
// utility/generateToken.js

const jwt = require('jsonwebtoken');

// Function to generate a JSON Web Token (JWT) for a given user ID
const generateToken = (userId) => {
    // Sign the token with the user ID and a secret key from environment variables
    return jwt.sign({ id }, process.env.JWT_SECRET, { 
        // Set the token to expire in 30 days
        expiresIn: "30d",
    });
};

// Export the generateToken function
module.exports = generateToken;