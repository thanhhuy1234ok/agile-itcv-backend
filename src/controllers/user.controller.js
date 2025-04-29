const userService = require('../services/user.service');
const { sendSuccess, sendError } = require('../utils/response');
const StatusCodes = require('../constants/statusCodes'); 

const getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        return sendSuccess(res, 'Users retrieved successfully', { users }, StatusCodes.OK);
    } catch (error) {
        console.error('Error retrieving users:', error);
        return sendError(res, StatusCodes.INTERNAL_SERVER_ERROR, 'Error retrieving users');
    }
};

const getUserById = async (req, res) => {
    try {
        const userId = req.params.id; 
        console.log('u',userId)
        const user = await userService.getUserById(userId);

        return sendSuccess(res, 'User retrieved successfully', { user });
    } catch (error) {
        console.error('Error retrieving user:', error);
        return sendError(res, StatusCodes.INTERNAL_SERVER_ERROR, 'Error retrieving user');
    }
};


const updateUser = async (req, res) => {
    try {
        const userId = req.user.id
        const updateData = req.body;

        if (!updateData || Object.keys(updateData).length === 0) {
            return sendError(res, StatusCodes.BAD_REQUEST, 'No update data provided');
        }

        const updatedUser = await userService.updateUser(userId, updateData);

        return sendSuccess(res, 'User updated successfully', { updatedUser }, StatusCodes.OK);
    } catch (error) {
        console.error('Error updating user:', error);
        return sendError(res, StatusCodes.INTERNAL_SERVER_ERROR, 'Error updating user');
    }
};

module.exports = {
    getAllUsers,
    updateUser,
    getUserById
};
