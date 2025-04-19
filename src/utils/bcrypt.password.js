const bcrypt = require('bcrypt');

const saltRounds = 10;

const encode_bcrypt = {
    hashPassword: async (password) => {
        if (!password) throw new Error('Password is required');
        try {
            const hash = await bcrypt.hash(password, saltRounds);
            return hash;
        } catch (error) {
            console.error('Hashing Error:', error);
            throw new Error('Error hashing password');
        }
    },

    comparePassword: async (password, hashedPassword) => {
        if (!password || !hashedPassword) throw new Error('Password and hash are required');
        try {
            return await bcrypt.compare(password, hashedPassword);
        } catch (error) {
            console.error('Comparison Error:', error);
            throw new Error('Error comparing password');
        }
    }
};

module.exports = encode_bcrypt;
