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

const verifyRefreshToken = async (token) => {
    try {
        return await jwt.verify(token, jwtRefreshSecret);
    } catch (err) {
        throw new Error('Refresh token không hợp lệ hoặc đã hết hạn');
    }
};

const verifyAccessToken = async (token) => {
    try {
        return await jwt.verify(token, jwtAccessSecret);
    } catch (err) {
        throw new Error('Access token không hợp lệ hoặc đã hết hạn');
    }
};

module.exports = { createAccessToken, createRefreshToken, verifyRefreshToken, verifyAccessToken };
