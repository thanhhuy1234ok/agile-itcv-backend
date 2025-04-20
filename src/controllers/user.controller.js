const userService = require('../services/user.service');

const getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        return res.status(200).json({
            message: 'Users retrieved successfully',
            data: users,
        });
    } catch (error) {
        console.error('Error retrieving users:', error);
        res.status(500).json({ message: 'Error retrieving users' });
    }
}

module.exports = {
    getAllUsers,
};