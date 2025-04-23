const ms = require('ms');
const authService = require('../services/auth.service');
const { jwtRefreshExpire } = require('../configs/env.config');

const create = async (req, res) => {
    try {
        const newUser = await authService.createUser(req.body);

        return res.status(201).json({
            code: 1,
            message: 'Đăng ký thành công',
            data: newUser,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ code: 0, message: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ code: 0, message: 'Email và mật khẩu là bắt buộc' });
        }

        const { user, accessToken ,refreshToken} = await authService.loginUser(email, password);

        res.cookie('refresh_Token', refreshToken, {
            httpOnly: true,
            maxAge: ms(jwtRefreshExpire)
        });

        return res.status(200).json({
            code: 1,
            message: 'Đăng nhập thành công',
            access_Token: accessToken,
            refresh_Token: refreshToken,
            data: user,
        });
    } catch (error) {
        console.error(error);
        res.status(401).json({ code: 0, message: error.message });
    }
};

const refreshAccessToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refresh_Token;
        if (!refreshToken) {
            return res.status(400).json({ code: 0, message: 'Refresh token là bắt buộc' });
        }

        const accessToken = await authService.getNewAccessToken(refreshToken);
        
        return res.status(200).json({ code: 1, access_Token: accessToken });
    } catch (error) {
        console.error(error);
        return res.status(401).json({ code: 0, message: error.message });
    }
};

module.exports = {
    create,
    login,
    refreshAccessToken
};
