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
        const roles = await RoleService.getAllRoles();
        console.log(roles);
        return sendSuccess(res, 'Lấy danh sách vai trò thành công', roles, StatusCodes.OK);
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
module.exports = {
    createRole,
    getAllRoles,
    getRoleById,
};