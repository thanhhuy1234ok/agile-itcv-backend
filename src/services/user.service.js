const User = require('../schema/user.schema.js');

const getAllUsers = async () => {
    try {
        const users = await User.find({ isDeleted: false });
        return users;
    } catch (error) {
        console.error('Error retrieving users:', error.message);
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

const updateUser = async (userId, updateData) => {
    try {
        if (!userId) {
            throw new Error('userId là bắt buộc');
        }
        const updatedUser = await User.findOneAndUpdate(
            { _id: userId, isDeleted: false }, 
            updateData,
            { new: true } 
        );

        if (!updatedUser) {
            throw new Error('User not found'); 
        }

        return updatedUser; 
    } catch (error) {
        console.error('Error updating user:', error.message);
        throw new Error(error.message);
    }
};

module.exports = {
    getAllUsers,
    updateUser,
    getUserById
};
