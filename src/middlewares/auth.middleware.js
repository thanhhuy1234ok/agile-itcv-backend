const { verifyAccessToken } = require('../utils/jwt');
const { sendError } = require('../utils/response'); 
const StatusCodes = require('../constants/statusCodes');

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return sendError(res, StatusCodes.UNAUTHORIZED, 'Không có access token');
        }

        const userData = await verifyAccessToken(token);

        if (!userData) {
            return sendError(res, StatusCodes.UNAUTHORIZED, 'Access token không hợp lệ');
        }

        req.user = userData;
        next();
    } catch (error) {
        console.error('AuthMiddleware Error:', error.message);
        return sendError(res, StatusCodes.UNAUTHORIZED, 'Access token không hợp lệ');
    }
};

module.exports = authMiddleware;
