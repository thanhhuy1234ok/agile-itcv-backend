const jwt = require('jsonwebtoken');
const { jwtRefreshExpire, jwtAccessSecret, jwtRefreshSecret, jwtAccessExpire } = require('../configs/env.config');

const createAccessToken = (payload) => {
    return jwt.sign(payload, jwtAccessSecret, {
        expiresIn: jwtAccessExpire,
    });
};

const createRefreshToken = (payload) => {
    return jwt.sign(payload, jwtRefreshSecret, {
        expiresIn: jwtRefreshExpire,
    });
};

module.exports = { createAccessToken, createRefreshToken};
