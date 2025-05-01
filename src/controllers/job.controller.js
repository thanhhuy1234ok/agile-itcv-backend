const { sendSuccess, sendError } = require('../utils/response.js');
const StatusCodes = require('../constants/statusCodes');  
const JobService = require('../services/job.service.js');

const createNewJob = async (req, res) => {
    try {
        const user = req.user;
        const jobData = req.body;
        const newJob = await JobService.createJob(jobData, user);
        sendSuccess(res, 'Tạo công việc thành công', newJob, StatusCodes.CREATED);
    } catch (error) {
        sendError(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message);
    }
}
const getAllJobs = async (req, res) => {
    try {
        const queryParams = req.query;
        const result = await JobService.getAllJobs(queryParams);
        sendSuccess(res, 'Lấy danh sách công việc thành công', { result }, StatusCodes.OK);
    } catch (error) {
        sendError(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message);
    }
}
const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await JobService.getJobById(jobId);
        sendSuccess(res, 'Lấy công việc thành công', job, StatusCodes.OK);
    } catch (error) {
        sendError(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message);
    }
}
const updateJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        const jobData = req.body;
        const user = req.user;
        const updatedJob = await JobService.updateJob(jobId, jobData, user);
        sendSuccess(res, 'Cập nhật công việc thành công', updatedJob, StatusCodes.OK);
    } catch (error) {
        sendError(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message);
    }
}
const deleteJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        const deleteJob = await JobService.deleteJob(jobId);
        sendSuccess(res, 'Xóa công việc thành công', deleteJob,StatusCodes.OK);
    } catch (error) {
        sendError(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message);
    }
}

module.exports = {
    createNewJob,
    getAllJobs,
    getJobById,
    updateJob,
    deleteJob
}
