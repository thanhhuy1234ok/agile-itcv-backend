const permissionService = require('../services/permission.service');
const { sendSuccess, sendError } = require('../utils/response');
const StatusCodes = require('../constants/statusCodes');

const createPermission = async (req, res) => {
    try {
        const { name, description, method, path } = req.body;
        const user = req.user;

        if (!name || !description || !method || !path) {
            return sendError(res, StatusCodes.BAD_REQUEST, 'Name, description, method và path là bắt buộc');
        }

        const permission = await permissionService.createPermission(
            { name, description, method, path },
            user
        );

        return sendSuccess(res, 'Tạo permission thành công', permission, StatusCodes.CREATED);
    } catch (error) {
        console.error('Create Permission Error:', error.message);
        return sendError(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message || 'Đã xảy ra lỗi server');
    }
};

const addPermissionToRole = async (req, res) => {
    try {
        const { roleId, permissionIds } = req.body;
        console.log(permissionIds)

        if (!roleId || !permissionIds) {
            return sendError(res, StatusCodes.BAD_REQUEST, 'roleId và permissionIds là bắt buộc');
        }

        const updatedRole = await permissionService.addPermissionToRole(roleId, permissionIds);

        return sendSuccess(res, 'Thêm permission vào role thành công', { role: updatedRole });
    } catch (error) {
        console.error('Add Permission To Role Error:', error.message);
        return sendError(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message || 'Đã xảy ra lỗi server');
    }
};

module.exports = {
    createPermission,
    addPermissionToRole,
};
