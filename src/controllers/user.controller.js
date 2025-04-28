const userService = require('../services/user.service');
const { sendSuccess, sendError } = require('../utils/response');

const getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        return sendSuccess(res, 'Users retrieved successfully', { users });
    } catch (error) {
        console.error('Error retrieving users:', error);
        return sendError(res, 500, 'Error retrieving users');
    }
};

const getUserById = async (req, res) => {
    try {
        const userId = req.query.id; 
        const user = await userService.getUserById(userId);

        return sendSuccess(res, 'User retrieved successfully', { user });
    } catch (error) {
        console.error('Error retrieving user:', error);
        return sendError(res, 500, 'Error retrieving user');
    }
};

const updateUser = async (req, res) => {
    try {
        const userId = req.query.id;
        const updateData = req.body;

        const updatedUser = await userService.updateUser(userId, updateData);

        return sendSuccess(res, 'User updated successfully', { updatedUser });
    } catch (error) {
        console.error('Error updating user:', error);
        return sendError(res, 500, 'Error updating user');
    }
};

module.exports = {
    getAllUsers,
    updateUser,
    getUserById
};
