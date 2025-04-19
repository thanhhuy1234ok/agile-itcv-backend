const User = require('../schema/user.schema.js');

const getAllUsers = async () => {
    try {
        const users = await User.find({ isDeleted: false });
        return users;
    } catch (error) {
        console.error('Error retrieving users:', error.message);
        throw new Error('Could not retrieve users');
    }
}



module.exports = {
    getAllUsers,
};
