const userService = require('../services/user.service');


const create = async (req, res) => {
    try {
        const { name, email, password, phone, address, dateOfBirth } = req.body;
        if (!name || !email || !password || !phone) {
            return res.status(400).json({ message: 'Name, email, password, and phone are required' });
        }
        const userData = {
            name,
            email,
            password,
            phone,
            address,
            dateOfBirth,
        };
         const newUser = await userService.createUser(userData);

        return res.status(201).json({
            message: 'User created successfully',
            data: newUser,
        });
         
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Error creating user' });
    }
}

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
    create,
    getAllUsers
};