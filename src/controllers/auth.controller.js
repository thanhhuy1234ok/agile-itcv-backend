const ms = require('ms');
const authService = require('../services/auth.service');
const { jwtRefreshExpire } = require('../configs/env.config');

const create = async (req, res) => {
    try {
        const newUser = await authService.createUser(req.body);

        return res.status(201).json({
            message: 'Đăng ký thành công',
            data: newUser,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email và mật khẩu là bắt buộc' });
        }

        const { user, accessToken ,refreshToken} = await authService.loginUser(email, password);

        res.cookie('refresh_Token', refreshToken, {
            httpOnly: true,
            maxAge: ms(jwtRefreshExpire)
        });

        return res.status(200).json({
            message: 'Đăng nhập thành công',
            access_Token: accessToken,
            refresh_Token: refreshToken,
            data: user,
        });
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: error.message });
    }
};

module.exports = {
    create,
    login
};