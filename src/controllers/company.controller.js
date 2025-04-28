const companiesService = require('../services/companies.service.js');


const createCompany = async (req, res) => {
    try {
        const { name, description, address } = req.body;
        const user = req.user;
        if (!name || !description || !address) {
            return res.status(400).json({ code: 0, message: 'Name, description và address là bắt buộc' });
        }

        const newCompany = await companiesService.createCompany({ name, description, address }, user);
        return res.status(201).json({
            code: 1,
            message: 'Tạo công ty thành công',
            data: newCompany,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ code: 0, message: error.message });
    }
}

const getAllCompanies = async (req, res) => {
    try {
        const companies = await companiesService.getAllCompanies();
        return res.status(200).json({
            code: 1,
            message: 'Lấy danh sách công ty thành công',
            data: companies,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ code: 0, message: error.message });
    }
}

module.exports = {
    createCompany,
    getAllCompanies,
};
