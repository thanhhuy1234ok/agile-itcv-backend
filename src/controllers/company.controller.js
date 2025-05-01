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

       
        const company = await companiesService.createCompany({ name, description, address }, user);

        
        return sendSuccess(res, 'Tạo công ty thành công', company, StatusCodes.CREATED);
    } catch (error) {
        console.error('Create Company Error:', error.message);
        return sendError(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message || 'Đã xảy ra lỗi server');
    }
};

const getAllCompanies = async (req, res) => {
    try {
        const result = await companiesService.getAllCompanies(req.query);
        return sendSuccess(res, 'Lấy danh sách công ty thành công', { result }, StatusCodes.OK);
    } catch (error) {
        console.error('Get All Companies Error:', error.message);
        return sendError(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message || 'Đã xảy ra lỗi server');
    }
};

const getCompanyById = async (req, res) => {
    try {
        const companyId = req.params.id;
        if (!companyId || companyId === ':id') {
            return sendError(res, StatusCodes.BAD_REQUEST, 'Company ID is required');
        }

        const result = await companiesService.getCompanyById(companyId);

        return sendSuccess(res, 'Lấy công ty thành công', { result });
    } catch (error) {
        console.error('Get Company By ID Error:', error.message);
        return sendError(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message || 'Đã xảy ra lỗi server');
    }
}
const updateCompany = async (req, res) => {
    try {
        const companyId = req.params.id;
        const updateData = req.body;

        if (!companyId) {
            return sendError(res, StatusCodes.BAD_REQUEST, 'Company ID is required');
        }

        if (!updateData || Object.keys(updateData).length === 0) {
            return sendError(res, StatusCodes.BAD_REQUEST, 'No update data provided');
        }

        const result = await companiesService.updateCompany(companyId, updateData, req.user);

        return sendSuccess(res, 'Cập nhật công ty thành công', { result });
    } catch (error) {
        console.error('Update Company Error:', error.message);
        return sendError(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message || 'Đã xảy ra lỗi server');
    }   
}
const deleteCompany = async (req, res) => {
    try {
        const companyId = req.params.id;
        if (!companyId || companyId === ':id') {
            return sendError(res, StatusCodes.BAD_REQUEST, 'Company ID is required');
        }

        const result = await companiesService.deleteCompany(companyId, req.user);

        return sendSuccess(res, 'Xóa công ty thành công', { result });
    } catch (error) {
        console.error('Delete Company Error:', error.message);
        return sendError(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message || 'Đã xảy ra lỗi server');
    }
}


module.exports = {
    createCompany,
    getAllCompanies,
    getCompanyById,
    updateCompany,
    deleteCompany,
};
