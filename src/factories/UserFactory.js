const User = require('../schema/user.schema');
const ROLES = require('../constants/role');

class UserFactory {
    static create({ name, email, password, role, phone, address, dateOfBirth }) {
        const roleValue = Object.values(ROLES).includes(role) ? role : ROLES.USER;

        return new User({
            name,
            email,
            password,
            role: roleValue,
            phone,
            address,
            dateOfBirth
        });
    }
}

module.exports = UserFactory;
