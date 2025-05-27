const fs = require('fs');
const { sendSuccess, sendError } = require('../utils/response.js');
const StatusCodes = require('../constants/statusCodes');
const resumeService = require('../services/resume.service.js');

// Resume Controllers
const createResume = async (req, res) => {
    try {
        const resumeData = req.body;
        const user = req.user;
        const resume = await resumeService.createResume(resumeData, user);
        return sendSuccess(res, 'Resume created successfully', resume, StatusCodes.CREATED);
    } catch (error) {
        return sendError(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message);
    }
};

const getAllResumes = async (req, res) => {
    try {
        const queryParams = req.query;
        const result = await resumeService.getAllResumes(queryParams);
        return sendSuccess(res, 'Resumes fetched successfully', { result }, StatusCodes.OK);
    } catch (error) {
        return sendError(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message);
    }
};

const getResumeById = async (req, res) => {
    try {
        const { id } = req.params;
        const resume = await resumeService.getResumeById(id);
        return sendSuccess(res, 'Resume fetched successfully', resume, StatusCodes.OK);
    } catch (error) {
        return sendError(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message);
    }
};

const updateResume = async (req, res) => {
    try {
        const { id } = req.params;
        const resumeData = req.body;
        const user = req.user;
        const resume = await resumeService.updateResume(id, resumeData, user);
        return sendSuccess(res, 'Resume updated successfully', resume, StatusCodes.OK);
    } catch (error) {
        return sendError(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message);
    }
};

const deleteResume = async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.user;
        const resume = await resumeService.deleteResume(id, user);
        return sendSuccess(res, 'Resume deleted successfully', resume, StatusCodes.OK);
    } catch (error) {
        return sendError(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message);
    }
};

const getResumeByUserId = async (req, res) => {
    try {
        const userId = req.user;
        const resumes = await resumeService.getResumeByUser(userId);
        return sendSuccess(res, 'Resumes fetched successfully', resumes, StatusCodes.OK);
    } catch (error) {
        return sendError(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message);
    }
};


const downloadCv = async (req, res) => {
    try {
        const { id } = req.params;
        const filePath = await resumeService.getCvFilePathById(id);

        if (!fs.existsSync(filePath)) {
            return sendError(res, StatusCodes.NOT_FOUND, 'CV file not found');
        }

        res.download(filePath, (err) => {
            if (err) {
                console.error('Error sending file:', err);
                return sendError(res, StatusCodes.INTERNAL_SERVER_ERROR, 'Error downloading CV');
            }
        });
    } catch (error) {
        console.error('Error downloading CV:', error);
        return sendError(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message);
    }
};

module.exports = {
    createResume,
    getAllResumes,
    getResumeById,
    updateResume,
    deleteResume,
    getResumeByUserId,
    downloadCv
};
