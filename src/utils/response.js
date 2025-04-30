const StatusCodes = require('../constants/statusCodes');

const sendSuccess = (res, message, data = {}, statusCode = StatusCodes.OK) => {
    return res.status(statusCode).json({
        code: 1,
        message,
        data,
    });
};

const sendError = (res, statusCode = StatusCodes.INTERNAL_SERVER_ERROR, message = 'Something went wrong') => {
    return res.status(statusCode).json({
        code: 0,
        message,
    });
};

module.exports = {
    sendSuccess,
    sendError,
};
