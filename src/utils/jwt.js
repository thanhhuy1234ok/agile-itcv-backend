const jwt = require('jsonwebtoken');

const createAccessToken = (user) => {
    const payload = {
        userId: user._id,
        email: user.email,
        role: user.role,  
    };
    return jwt.sign(payload, process.env.JWT_ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.JWT_ACCESS_EXPIRE,
    });
};

module.exports = createAccessToken;
