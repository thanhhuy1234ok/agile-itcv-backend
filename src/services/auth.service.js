const encode_bcrypt = require('../utils/bcrypt.password.js');
const User = require('../schema/user.schema.js');
const Role = require('../schema/roles.schema.js');
const UserFactory = require('../factories/UserFactory.js');
const { NORMAL_USER } = require('../constants/role.js');
const createJwtPayload = require('../utils/jwtPayload.js')
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

        const findRole = await Role.findOne({ name: NORMAL_USER });

        if (!findRole) {
            throw new Error('Không tìm thấy vai trò người dùng');
        }

        const hashedPassword = await encode_bcrypt.hashPassword(password);

        const newUser = UserFactory.create({
            name,
            email,
            password: hashedPassword,
            phone,
            role:{
                _id: findRole._id,
                name: findRole.name,
            },
            address,
            dateOfBirth,
        });

        const savedUser = await newUser.save();

        return savedUser;
    } catch (error) {
        console.error('Lỗi khi tạo người dùng:', error.message);
        throw new Error(error.message);
    }
};

const loginUser = async (userData) => {
    try {
        const { email, password } = userData;
        if (!email || !password) {
            throw new Error('Email, password là bắt buộc');
        }

        const user = await User.findOne({ email, isDeleted: false });

        if (!user) {
            throw new Error('Không tìm thấy người dùng');
        }

        const isMatch = await encode_bcrypt.comparePassword(password, user.password);

        if (!isMatch) {
            throw new Error('Mật khẩu không đúng');
        }

        const payload = createJwtPayload(user);

        const accessToken = createAccessToken(payload);
        const refreshToken = createRefreshToken(payload);

        await User.updateOne(
            { _id: user._id },
            { $set: { refresh_Token: refreshToken } }
        );

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

        const decoded = await verifyRefreshToken(refreshToken);

        const user = await User.findById(decoded._id).select('_id name email role');
        if (!user) {
            throw new Error('Không tìm thấy người dùng');
        }

        const payload = createJwtPayload(user);
        const accessToken = createAccessToken(payload);

        return { accessToken, user };
    } catch (error) {
        console.error('Lỗi khi làm mới access token:', error.message);
        throw new Error(error.message);
    }
};

const logoutUser = async (refreshToken,user) => {
    try {
        console.log('refreshToken', refreshToken);
        console.log(user._id);
        return await User.findOneAndUpdate({ _id: user._id }, { refresh_Token: refreshToken }, { new: true });
    } catch (error) {
        console.error('Lỗi khi đăng xuất:', error.message);
        throw new Error(error.message);
    }
}



module.exports = {
    createUser,
    loginUser,
    getNewAccessToken,
    logoutUser,
};