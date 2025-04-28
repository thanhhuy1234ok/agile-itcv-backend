const Company = require('../schema/companies.schema.js');

const createCompany = async (companyData, user) => {
    try {
        const { name,description , address } = companyData;

        if (!name || !description || !address) {
            throw new Error('Name, description và address là bắt buộc');
        }

        const newCompany = new Company({
            name,
            description,
            address,
            createdBy:{
                _id: user.id,
                email: user.email,
            }
        });

        const savedCompany = await newCompany.save();

        return savedCompany;
    } catch (error) {
        console.error('Lỗi khi tạo công ty:', error.message);
        throw new Error(error.message);
    }
}

const getAllCompanies = async () => {
    try {
        const company = await Company.find({ isDeleted: false })
            .sort({ createdAt: -1 });
        return company;
    } catch (error) {
        console.error('Lỗi khi lấy danh sách công ty:', error.message);
        throw new Error(error.message);
    }
}

module.exports = {
    createCompany,
    getAllCompanies,
};