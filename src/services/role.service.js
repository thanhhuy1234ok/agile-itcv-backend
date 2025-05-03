const Role = require('../schema/roles.schema.js');
const {paginate,softDeleteDocument} = require('../utils/queryMongoose.js');
const { PROTECT_ROLE } = require('../constants/protect.delete.js');

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

const getAllRoles = async (queryParams) => {
    try {
        const roles = await paginate(Role, queryParams,)
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

const updateRole = async (id, data, user) => {
    try {
        const { _id, email } = user;

        const role = await Role.findById(id).where({ isDeleted: false });
        if (!role) {
            throw new Error('Không tìm thấy vai trò');
        }

        if (data.name) {
            const checkNameRole = await Role.findOne({ name: data.name, isDeleted: false });
            if (checkNameRole && checkNameRole._id.toString() !== id) {
                throw new Error('Tên vai trò đã tồn tại');
            }
        }

        const updateFields = {
            updatedBy: {
                _id: _id,
                email: email,
            },
        };

        if (data.name) updateFields.name = data.name;
        if (data.description) updateFields.description = data.description;

        const updatedRole = await Role.findByIdAndUpdate(
            id,
            updateFields,
            { new: true }
        ).where({ isDeleted: false });

        return updatedRole;
    } catch (error) {
        console.error("Error updating role:", error);
        throw new Error("Failed to update role");
    }
};


const deleteRole = async (id, user) => {
    try {
        const deletedRole = await softDeleteDocument(Role, id, user, {
            protectRole: PROTECT_ROLE,
        });
        
        return deletedRole;
    } catch (error) {
        console.error("Error deleting role:", error);
        throw new Error("Failed to delete role");
    }
}


module.exports = {
    createRole,
    getAllRoles,
    getRoleById,
    updateRole,
    deleteRole,
};  