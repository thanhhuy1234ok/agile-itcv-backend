const encode_bcrypt = require('../utils/bcrypt.password.js');
const User = require('../schema/user.schema.js');

const createUser = async (userData) => {
    try {
        const { name, email, password, phone, address, dateOfBirth } = userData;

        if (!name || !email || !password) {
            throw new Error('Name, email, and password are required');
        }

        const hashedPassword = await encode_bcrypt.hashPassword(password);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            phone,
            address,
            dateOfBirth,
        });

        const savedUser = await newUser.save();
        return savedUser;
    } catch (error) {
        console.error('Error creating user:', error.message);
        throw new Error('Could not create user');
    }
};

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
    createUser, getAllUsers,
};