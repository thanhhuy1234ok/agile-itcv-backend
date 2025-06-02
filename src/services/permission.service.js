const Permission = require('../schema/permission.schema');
const RoleSchema = require('../schema/roles.schema');

const createPermission = async (data, user) => {
  const permission = new Permission({
    name: data.name,
    description: data.description,
    method: data.method.toUpperCase(),
    path: data.path,
    createdBy: {
      _id: user._id,
      email: user.email,
    },
  });

  return await permission.save();
};

const addPermissionToRole = async (roleId, permissionIds) => {
 
  const role = await RoleSchema.findOne({ _id: roleId, isDeleted: false });
  if (!role) {
    throw new Error('Role không tồn tại');
  }

  const newPermissions = permissionIds.filter(
    id => !role.permissions.some(existingId => existingId.toString() === id.toString())
  );

  if (newPermissions.length === 0) {
    return role;
  }

  role.permissions.push(...newPermissions);

  return await role.save();
};

module.exports = {
  createPermission,
  addPermissionToRole,
};
