const RoleService = require('../services/role.service');
const { sendSuccess, sendError } = require('../utils/response.js');
const StatusCodes = require('../constants/statusCodes');  

const createRole = async (req, res) => {
    try {
        const user = req.user;
        const data = req.body;
        const role = await RoleService.createRole(data, user);

        return sendSuccess(res, 'Tạo vai trò thành công', role, StatusCodes.ACCEPTED);
    } catch (error) {
        return sendError(res, StatusCodes.BAD_REQUEST, error.message);
    }
}
const getAllRoles = async (req, res) => {
    try {
        const result = await RoleService.getAllRoles(req.query);
        return sendSuccess(res, 'Lấy danh sách vai trò thành công', { result }, StatusCodes.OK);
    } catch (error) {
        return sendError(res, StatusCodes.BAD_REQUEST, error.message);
    }
}

const getRoleById = async (req, res) => {
    try {
        const id = req.params.id;
        const role = await RoleService.getRoleById(id);
        return sendSuccess(res, 'Lấy vai trò thành công', role, StatusCodes.OK);
    } catch (error) {
        return sendError(res, StatusCodes.BAD_REQUEST,error.message);
    }
}

const updateRole = async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const user = req.user;
        const role = await RoleService.updateRole(id, data, user);
        return sendSuccess(res, 'Cập nhật vai trò thành công', role, StatusCodes.OK);
    } catch (error) {
        return sendError(res, StatusCodes.BAD_REQUEST,error.message);
    }
}
const deleteRole = async (req, res) => {
    try {
        const id = req.params.id;
        const user = req.user;
        const role = await RoleService.deleteRole(id, user);
        return sendSuccess(res, 'Xóa vai trò thành công', role, StatusCodes.OK);
    } catch (error) {
        return sendError(res, StatusCodes.BAD_REQUEST,error.message);
    }
}

module.exports = {
    createRole,
    getAllRoles,
    getRoleById,
    updateRole,
    deleteRole,
};