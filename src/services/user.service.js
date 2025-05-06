const User = require('../schema/user.schema.js');
const {paginate,softDeleteDocument} = require('../utils/queryMongoose.js');
const { PROTECT_EMAIL, PROTECT_ROLE } = require('../constants/protect.delete.js');
const encode_bcrypt = require('../utils/bcrypt.password.js');
const Role = require('../schema/roles.schema.js');
const getAllUsers = async (queryParams) => {
    try {
        const users = await paginate(User, queryParams)
        return users;
    } catch (error) {
        console.error('Error retrieving users:', error.message);
        throw new Error(error.message);
    }
};

const createUser = async (userData, user) => {
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

        const checkRole = await Role.findOne({ _id: role, isDeleted: false });
        if (!checkRole) {
            throw new Error('Vai trò không tồn tại');
        }

        const hashedPassword = await encode_bcrypt.hashPassword(password);

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            phone,
            address,
            dateOfBirth,
            role:{
                _id: checkRole._id,
                name: checkRole.name,
            },
            createdBy: {
                _id: user._id,
                email: user.email,
            },
        });

        const savedUser = await newUser.save();

        return savedUser;
    } catch (error) {
        console.error('Lỗi khi tạo người dùng:', error.message);
        throw new Error(error.message);
    }
};


const getUserById = async (userId) => {
    try {
        if (!userId) {
            throw new Error('userId là bắt buộc');
        }
        const user = await User.findById(userId);

        if (!user) {
            throw new Error('User not found');
        }

        return user;
    } catch (error) {
        console.error('Error fetching user:', error.message);
        throw new Error(error.message);
    }
};

const updateUser = async (userId, updateData, currentUser = null) => {
    try {
        if (!userId) throw new Error('Thiếu userId');

        if (updateData.role && typeof updateData.role === 'string') {
            const role = await Role.findById(updateData.role);
            if (!role) throw new Error('Không tìm thấy vai trò');

            updateData.role = {
                _id: role._id,
                name: role.name,
            };
        }

        if (currentUser) {
            updateData.updatedBy = {
                _id: currentUser._id,
                email: currentUser.email,
            };
        }

        updateData.updatedAt = new Date();

        const updatedUser = await User.findOneAndUpdate(
            { _id: userId, isDeleted: false },
            updateData,
            { new: true }
        );

        if (!updatedUser) throw new Error('Không tìm thấy user');

        return updatedUser;
    } catch (error) {
        console.error(error);
        throw new Error(error.message);
    }
};

const deleteUser = async (userId, currentUser) => {
    try {
        const deletedUser = await softDeleteDocument(User, userId, currentUser, {
            protectEmail: PROTECT_EMAIL,
            protectRole: PROTECT_ROLE,
        });
        return deletedUser;
    } catch (error) {
        console.error('Error deleting user:', error.message);
        throw new Error(error.message);

    }
}

module.exports = {
    createUser,
    getAllUsers,
    updateUser,
    getUserById,
    deleteUser,
};
