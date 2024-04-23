const jsonwebtoken = require('jsonwebtoken');
const errorHandler = require('../utility/errorHandler');
const jsonSecret = process.env.JSONSECRET;

const validateUserToken = (req, res, next) => {
    const token = req.cookies.token;

    if(!token)
        return next(errorHandler(401, 'Unauthorized'));

        jsonwebtoken.verify(token, jsonSecret, (error, userData) => {
            if (error) 
                return next(errorHandler(405, 'Forbidden'))

                console.log(userData);
                req.userData = userData;
                next();
        })
}

module.exports = validateUserToken;