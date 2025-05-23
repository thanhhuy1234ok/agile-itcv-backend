const User = require('../schema/user.schema');

class UserFactory {
    static create({ name, email, password, role, phone, address, dateOfBirth }) {
        return new User({
            name,
            email,
            password,
            role: {
                _id: role._id,
                name: role.name,
            },
            phone,
            address,
            dateOfBirth
        });
    }
}

module.exports = UserFactory;
