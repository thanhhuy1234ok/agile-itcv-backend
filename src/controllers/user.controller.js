const userService = require('../services/user.service');
const { sendSuccess, sendError } = require('../utils/response');
const StatusCodes = require('../constants/statusCodes'); 

const createUser = async (req, res) => {
    try {
        const userData = req.body; 
        const user = req.user;
        if (!userData) {
            return sendError(res, StatusCodes.BAD_REQUEST, 'User data is required');
        }

        const newUser = await userService.createUser(userData,user); 

        return sendSuccess(res, 'User created successfully', newUser, StatusCodes.CREATED);
    } catch (error) {
        console.error('Error creating user:', error);
        return sendError(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message || 'Error creating user');
    }
};

const getAllUsers = async (req, res) => {
    try {
        const result = await userService.getAllUsers(req.query); 
        return sendSuccess(res, 'Users retrieved successfully', { result }, StatusCodes.OK);
    } catch (error) {
        console.error('Error retrieving users:', error);
        return sendError(res, StatusCodes.INTERNAL_SERVER_ERROR, 'Error retrieving users');
    }
};

const getUserById = async (req, res) => {
    try {
        const userId = req.params.id; 
        if (!userId || userId === ':id') {
            return sendError(res, StatusCodes.BAD_REQUEST,error.message || 'User ID is required');
        }

        const result = await userService.getUserById(userId);

        return sendSuccess(res, 'User retrieved successfully', { result });
    } catch (error) {
        console.error('Error retrieving user:', error);
        return sendError(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message || 'Error retrieving user');
    }
}; 

const updateUser = async (req, res) => {
    try {
        const user = req.user
        const updateData = req.body;
        const userId = req.params.id;

        if (!userId || userId === ':id') {
            return sendError(res, StatusCodes.BAD_REQUEST, 'User ID is required');
        }

    

        if (!updateData || Object.keys(updateData).length === 0) {
            return sendError(res, StatusCodes.BAD_REQUEST, 'No update data provided');
        }

        const updatedUser = await userService.updateUser(userId, updateData, user);

        return sendSuccess(res, 'User updated successfully', { updatedUser }, StatusCodes.OK);
    } catch (error) {
        console.error('Error updating user:', error);
        return sendError(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message || 'Error updating user');
    }
};

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id; 
        const currentUser = req.user; 

        if (!userId || userId === ':id') {
            return sendError(res, StatusCodes.BAD_REQUEST, 'User ID is required');
        }

        const deletedUser = await userService.deleteUser(userId, currentUser); 

        return sendSuccess(res, 'User deleted successfully', { deletedUser }, StatusCodes.OK);
    } catch (error) {
        console.error('Error deleting user:', error);
        return sendError(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message || 'Error deleting user');
    }
};

module.exports = {
    createUser,
    getAllUsers,
    updateUser,
    getUserById,
    deleteUser,
};
