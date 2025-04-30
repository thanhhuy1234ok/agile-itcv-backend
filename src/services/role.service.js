const Role = require('../schema/roles.schema.js');

const createRole = async (data,user) =>{
    try {
        const { _id, email } = user;

        const {name, description} = data;
        const checkNameRole = await Role.findOne({name: name, isDeleted: false});
        
        if (checkNameRole) {
            throw new Error('Tên vai trò đã tồn tại');
        }

        if (!name || !description) {
            throw new Error('Tên vai trò và mô tả là bắt buộc');
        }

        const role = await Role.create({
            name: name,
            description: description,
            createdBy: {
                _id: _id,
                email: email
            },
        });
        return role;
    } catch (error) {
        console.error("Error creating role:", error);
        throw new Error("Failed to create role");
        
    }
}

const getAllRoles = async () => {
    try {
        const roles = await Role.find({isDeleted: false});
        console.log(roles);
        return roles;
    } catch (error) {
        console.error("Error fetching roles:", error);
        throw new Error("Failed to fetch roles");
    }
}

const getRoleById = async (id) => {
    try {
        const role = await Role.findById(id).where({isDeleted: false});
        if (!role) {
            throw new Error('Không tìm thấy vai trò');
        }
        return role;
    } catch (error) {
        console.error("Error fetching role by ID:", error);
        throw new Error("Failed to fetch role by ID");
    }
}

module.exports = {
    createRole,
    getAllRoles,
    getRoleById,
};  