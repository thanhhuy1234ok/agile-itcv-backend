require('dotenv').config();

module.exports = {
    env: process.env.NODE_ENV || 'dev',

    port: process.env.PORT || 8080,
    
    dbUriDev: process.env.MONGODB_URI_DEV || '',
    dbUriProd: process.env.MONGODB_URI_PROD || '',

    jwtAccessSecret: process.env.JWT_ACCESS_TOKEN_SECRET || '',
    jwtAccessExpire: process.env.JWT_ACCESS_EXPIRE || '',

    jwtRefreshSecret: process.env.JWT_REFRESH_TOKEN_SECRET || '',
    jwtRefreshExpire: process.env.JWT_REFRESH_EXPIRE || '',
};