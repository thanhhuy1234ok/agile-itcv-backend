const ms = require('ms');
const authService = require('../services/auth.service');
const { jwtRefreshExpire } = require('../configs/env.config');
const { sendSuccess, sendError } = require('../utils/response');
const StatusCodes = require('../constants/statusCodes');

const create = async (req, res) => {
    try {
        const newUser = await authService.createUser(req.body);
        
        return sendSuccess(res, 'Đăng ký thành công', { user: newUser }, StatusCodes.CREATED);
    } catch (error) {
        console.error('Create User Error:', error.message);
        return sendError(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message);
    }
};

const login = async (req, res) => {
    try {
        const { user, accessToken, refreshToken } = await authService.loginUser(req.body);

        res.cookie('refresh_Token', refreshToken, {
            httpOnly: true,
            maxAge: ms(jwtRefreshExpire),
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
        });

        return sendSuccess(res, 'Đăng nhập thành công', {
            access_Token: accessToken,
            refresh_Token: refreshToken,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            },
        }, StatusCodes.OK);
    } catch (error) {
        console.error('Login Error:', error.message);
        return sendError(res, StatusCodes.UNAUTHORIZED, error.message);
    }
};

const refreshAccessToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refresh_Token;
        if (!refreshToken) {
            return sendError(res, StatusCodes.BAD_REQUEST, 'Refresh token là bắt buộc');
        }

        const { accessToken, user } = await authService.getNewAccessToken(refreshToken);

        return sendSuccess(res, 'Làm mới access token thành công', {
            access_Token: accessToken,
            user,
        }, StatusCodes.OK);
    } catch (error) {
        console.error('Refresh Access Token Error:', error.message);
        return sendError(res, StatusCodes.UNAUTHORIZED, error.message);
    }
};

const logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refresh_Token;
        if (!refreshToken) {
            return sendError(res, StatusCodes.BAD_REQUEST, 'Refresh token là bắt buộc');
        }

        const user = req.user;

        await authService.logoutUser("", user);

        res.clearCookie('refresh_Token', {
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
        });

        return sendSuccess(res, 'Đăng xuất thành công', {}, StatusCodes.OK);
    } catch (error) {
        console.error('Logout Error:', error.message);
        return sendError(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message);
    }
};

module.exports = {
    create,
    login,
    refreshAccessToken,
    logout
};
