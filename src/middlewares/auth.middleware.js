const { verifyRefreshToken } = require('../utils/jwt');

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers['authorization']?.split(' ')[1];
        console.log(token);
        if (!token) {
            return res.status(401).json({ message: 'Không có access token' });
        }

        const userData = await verifyRefreshToken(token); // verify token
        console.log(userData);
        if (!userData) {
            return res.status(401).json({ message: 'Access token không hợp lệ' });
        }

        req.user = userData

        next();
    } catch (error) {
        console.error('AuthMiddleware Error:', error.message);
        return res.status(401).json({ message: 'Access token không hợp lệ' });
    }
};

module.exports = authMiddleware;
