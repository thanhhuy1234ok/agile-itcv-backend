const ms = require('ms');
const authService = require('../services/auth.service');
const { jwtRefreshExpire } = require('../configs/env.config');
const { sendSuccess, sendError } = require('../utils/response');

const create = async (req, res) => {
    try {
        const newUser = await authService.createUser(req.body);

        return sendSuccess(res, 'Đăng ký thành công', {
            user: newUser,
        });
    } catch (error) {
        console.error(error);
        return sendError(res, 500, error.message);
    }
};

const login = async (req, res) => {
    try {

        const { user, accessToken, refreshToken } = await authService.loginUser(req.body);

        res.cookie('refresh_Token', refreshToken, {
            httpOnly: true,
            maxAge: ms(jwtRefreshExpire),
        });

        return sendSuccess(res, 'Đăng nhập thành công', {
            access_Token: accessToken,
            refresh_Token: refreshToken,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error(error);
        return sendError(res, 401, error.message);
    }
};

const refreshAccessToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refresh_Token;
        if (!refreshToken) {
            return sendError(res, 400, 'Refresh token là bắt buộc');
        }

        const { accessToken, user } = await authService.getNewAccessToken(refreshToken);

        return sendSuccess(res, 'Làm mới access token thành công', {
            access_Token: accessToken,
            user,
        });
    } catch (error) {
        console.error(error);
        return sendError(res, 401, error.message);
    }
};

module.exports = {
    create,
    login,
    refreshAccessToken,
};
