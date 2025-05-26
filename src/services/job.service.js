const { paginate, softDeleteDocument } = require('../utils/queryMongoose.js');
const Job = require('../schema/jobs.schema.js');
const Company = require('../schema/companies.schema.js');

const createJob = async(jobData, user) => {
    try {
        const { name, description, companyId, skill, salary, quantity, level, startDate, endDate, location } = jobData
        if (!name || !description || !companyId || !salary || !quantity || !level || !startDate || !endDate || !location) {
            throw new Error('name, description, companyId, salary, quantity, level, location ,startDate và endDate là bắt buộc');
        }

        const company = await Company.findById(companyId).where({ isDeleted: false });
        if (!company) {
            throw new Error('Không tìm thấy công ty');
        }
        const newJob = new Job({
            name,
            description,
            companyId:{
                _id: company._id,
                name: company.name,
                address: company.address,
            },
            skill,
            location,
            salary: +salary,
            quantity: +quantity,
            level,
            startDate,
            endDate,
            createdBy: {
                _id: user._id,
                email: user.email,
            },
        });
        const savedJob = await newJob.save();
        return savedJob;
    }
    catch (error) {
        console.error('Lỗi khi tạo công việc:', error.message);
        throw new Error(error.message);
    }
}
const getAllJobs = async (queryParams) => {
    try {
        const objectIdFields = ['companyId._id'];
        const jobs = await paginate(Job, queryParams, '', objectIdFields);
        return jobs;
    } catch (error) {
        console.error('Lỗi khi lấy danh sách công việc:', error.message);
        throw new Error(error.message);
    }
};
const getJobById = async(id) => {
    try {
        const job = await Job.findById(id).where({ isDeleted: false });
        if (!job) {
            throw new Error('Không tìm thấy công việc');
        }
        return job;
    } catch (error) {
        console.error('Lỗi khi lấy công việc theo ID:', error.message);
        throw new Error(error.message);
    }
}
const updateJob = async (id, data, user) => {
    try {
        if (!id) {
            throw new Error('ID công việc là bắt buộc');
        }

        const job = await Job.findById(id).where({ isDeleted: false });
        if (!job) {
            throw new Error('Không tìm thấy công việc');
        }

        if (data.name) job.name = data.name;
        if (data.description) job.description = data.description;
        if (data.salary !== undefined) job.salary = data.salary;
        if (data.quantity !== undefined) job.quantity = data.quantity;
        if (data.level) job.level = data.level;
        if (data.skill) job.skill = data.skill;
        if (data.startDate) job.startDate = new Date(data.startDate);
        if (data.endDate) job.endDate = new Date(data.endDate);
        if (data.location) job.location = data.location;

        if (data.companyId && data.companyName) {
            job.companyId = {
                _id: data.companyId,
                name: data.companyName,
            };
        }

        job.updatedBy = {
            _id: user._id,
            email: user.email,
        };
        job.updatedAt = new Date();

        const updatedJob = await job.save();
        return updatedJob;
    } catch (error) {
        console.error('Lỗi khi cập nhật công việc:', error.message);
        throw new Error(error.message);
    }
};

const deleteJob = async(id, user) => {
    try {
        if (!id) {
            throw new Error('ID công việc là bắt buộc');
        }
        const job = await Job.findById(id).where({
            isDeleted: false
        });
        if (!job) {
            throw new Error('Không tìm thấy công việc');
        }
        const deletedJob = await softDeleteDocument(Job, id, user);
        return deletedJob;
    } catch (error) {
        console.error('Lỗi khi xóa công việc:', error.message);
        throw new Error(error.message);
    }
}

module.exports = {
    createJob,
    getAllJobs,
    getJobById,
    updateJob,
    deleteJob
}
