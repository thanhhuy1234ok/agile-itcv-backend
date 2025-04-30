const companiesService = require('../services/companies.service');
const { sendSuccess, sendError } = require('../utils/response'); 
const StatusCodes = require('../constants/statusCodes');

const createCompany = async (req, res) => {
    try {
        const { name, description, address } = req.body;
        const user = req.user;

        
        if (!name || !description || !address) {
            return sendError(res, StatusCodes.BAD_REQUEST, 'Name, description và address là bắt buộc');
        }

       
        const newCompany = await companiesService.createCompany({ name, description, address }, user);

        
        return sendSuccess(res, 'Tạo công ty thành công', { company: newCompany }, StatusCodes.CREATED);
    } catch (error) {
        console.error('Create Company Error:', error.message);
        return sendError(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message || 'Đã xảy ra lỗi server');
    }
};

const getAllCompanies = async (req, res) => {
    try {
        const companies = await companiesService.getAllCompanies();

        return sendSuccess(res, 'Lấy danh sách công ty thành công', { companies });
    } catch (error) {
        console.error('Get All Companies Error:', error.message);
        return sendError(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message || 'Đã xảy ra lỗi server');
    }
};

module.exports = {
    createCompany,
    getAllCompanies,
};
