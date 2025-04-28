const sendSuccess = (res, message, data = {}) => {
    return res.status(200).json({
        code: 1,
        message,
        data,
    });
};

const sendError = (res, statusCode = 500, message = 'Something went wrong') => {
    return res.status(statusCode).json({
        code: 0,
        message,
    });
};

module.exports = {
    sendSuccess,
    sendError,
};