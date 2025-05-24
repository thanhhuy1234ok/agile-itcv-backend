const Company = require('../schema/companies.schema.js');
const { paginate, softDeleteDocument } = require('../utils/queryMongoose.js');

const createCompany = async (companyData, user) => {
    try {
        const { name, description, address, logo } = companyData;

        if (!name || !description || !address) {
            throw new Error('Name, description và address là bắt buộc');
        }

        const newCompany = new Company({
            name,
            description,
            address,
            logo: logo || null, 
            createdBy: {
                _id: user._id,
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



const getAllCompanies = async (queryParams) => {
    try {
        const companies = await paginate(Company, queryParams);
        return companies;
    } catch (error) {
        console.error('Lỗi khi lấy danh sách công ty:', error.message);
        throw new Error(error.message);
    }
}

const getCompanyById = async (id) => {
    try {
        const company = await Company.findById(id).where({ isDeleted: false });
        if (!company) {
            throw new Error('Không tìm thấy công ty');
        }
        return company;
    } catch (error) {
        console.error('Lỗi khi lấy công ty theo ID:', error.message);
        throw new Error(error.message);
    }
}

const updateCompany = async (id, data, user) => {
    try {
        if (!id) {
            throw new Error('ID công ty là bắt buộc');
        }

        const company = await Company.findById(id).where({ isDeleted: false });
        if (!company) {
            throw new Error('Không tìm thấy công ty');
        }

        if (data.name) company.name = data.name;
        if (data.description) company.description = data.description;
        if (data.address) company.address = data.address;
        if (typeof data.isActive === 'boolean') company.isActive = data.isActive;
        if (data.logo) company.logo = data.logo; 

        company.updatedBy = {
            _id: user._id,
            email: user.email,
        };
        company.updatedAt = new Date();

        const updatedCompany = await company.save();
        return updatedCompany;
    } catch (error) {
        console.error('Lỗi khi cập nhật công ty:', error.message);
        throw new Error(error.message);
    }
};



const deleteCompany = async (id, user) => {
    try {
        const company = await Company.findById(id).where({ isDeleted: false });
        if (!company) {
            throw new Error('Không tìm thấy công ty');
        }

        const deletedCompany = await softDeleteDocument(Company,id ,user);

        return deletedCompany;
    } catch (error) {
        console.error('Lỗi khi xóa công ty:', error.message);
        throw new Error(error.message);
    }
}


module.exports = {
    createCompany,
    getAllCompanies,
    getCompanyById,
    updateCompany,
    deleteCompany,
};