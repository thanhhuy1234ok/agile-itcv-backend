const encode_bcrypt = require('../utils/bcrypt.password.js');
const User = require('../schema/user.schema.js');
const UserFactory = require('../factories/UserFactory.js');
const { createAccessToken, createRefreshToken, verifyRefreshToken } = require('../utils/jwt.js')

const createUser = async (userData) => {
    try {
        const { name, email, password, phone, address, dateOfBirth, role } = userData;

        if (!name || !email || !password || !phone) {
            throw new Error('Name, email, password và phone là bắt buộc');
        }

        const existingEmail = await User.findOne({ email, isDeleted: false });
        if (existingEmail) {
            throw new Error('Email đã tồn tại');
        }

        const existingPhone = await User.findOne({ phone, isDeleted: false });
        if (existingPhone) {
            throw new Error('Số điện thoại đã tồn tại');
        }

        const hashedPassword = await encode_bcrypt.hashPassword(password);

        const newUser = UserFactory.create({
            name,
            email,
            password: hashedPassword,
            phone,
            address,
            dateOfBirth,
            role,
        });

        const savedUser = await newUser.save();

        return savedUser;
    } catch (error) {
        console.error('Lỗi khi tạo người dùng:', error.message);
        throw new Error(error.message);
    }
};

const loginUser = async (email, password) => {
    try {
        const user = await User.findOne({ email, isDeleted: false });

        if (!user) {
            throw new Error('Không tìm thấy người dùng');
        }

        const isMatch = await encode_bcrypt.comparePassword(password, user.password);

        if (!isMatch) {
            throw new Error('Mật khẩu không đúng');
        }

        const payload = {
            id: user._id,
            email: user.email,
            role: user.role,
        };

        const accessToken = createAccessToken(payload);
        const refreshToken = createRefreshToken(payload);

        return {
            accessToken,
            refreshToken,
            user,
        };
    } catch (error) {
        console.error('Lỗi khi đăng nhập:', error.message);
        throw new Error(error.message);
    }
};

const getNewAccessToken = async (refreshToken) => {
    try {
        if (!refreshToken) {
            throw new Error('Refresh token là bắt buộc');
        }

        const decoded = verifyRefreshToken(refreshToken);

        const accessToken = createAccessToken({
            userId: decoded.userId,
            email: decoded.email,
            role: decoded.role,
        });

        const user = await User.findById(decoded.userId).select('_id name email role');
        if (!user) {
            throw new Error('Không tìm thấy người dùng');
        }

        return { accessToken, user };
    } catch (error) {
        console.error('Lỗi khi làm mới access token:', error.message);
        throw new Error(error.message);
    }
};


module.exports = {
    createUser,
    loginUser,
    getNewAccessToken
};