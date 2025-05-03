const { paginate, softDeleteDocument } = require('../utils/queryMongoose.js');
const Resume = require('../schema/resume.schema.js');
const StatusResume = require('../constants/status.resume.js');
const { analyzeCV } = require('../services/ai.service');
const path = require('path');

// const createResume = async (resumeData, user, cvPath) => {
//     try {
//         const { companyId, jobId } = resumeData;
//         const newResumer = new Resume({
//             companyId,
//             jobId,
//             userId: user._id,
//             email: user.email,
//             status: StatusResume.PENDING,
//             createdBy: {
//                 _id: user._id,
//                 email: user.email
//             },
//             history: [
//                 {
//                     status: StatusResume.PENDING,
//                     updatedBy: {
//                         _id: user._id,
//                         email: user.email
//                     }
//                 }
//             ]
//         });
//         const resume = await newResumer.save();
//         return resume;

//     } catch (error) {
//         console.error('Error creating resume:', error);
//         throw new Error('Error creating resume: ' + error.message);
//     }
// }

const createResume = async (resumeData, user) => {
    try {
        const { companyId, jobId ,url} = resumeData;

        const analysisResult = await analyzeCV(url,jobId);

        const newResume = new Resume({
            companyId,
            jobId,
            userId: user._id,
            email: user.email,
            cvPath: url, 
            status: StatusResume.PENDING, 
            score: analysisResult.score,
            matchedSkills: analysisResult.matchedSkills,
            analysis: analysisResult.analysis,
            createdBy: {
                _id: user._id,
                email: user.email
            },
            history: [
                {
                    status: StatusResume.PENDING, 
                    updatedBy: {
                        _id: user._id,
                        email: user.email
                    }
                }
            ]
        });

        const resume = await newResume.save();

        return resume;

    } catch (error) {
        console.error('Error creating resume:', error);
        throw new Error('Error creating resume: ' + error.message);
    }
};

const getAllResumes = async (queryParams) => {
    try {
        const resumes = await paginate(Resume, queryParams);
        return resumes;
    } catch (error) {
        console.error('Error fetching resumes:', error);
        throw new Error('Error fetching resumes: ' + error.message);
    }
}

const getResumeById = async (id) => {
    try {
        const resume = await Resume.findById(id).where({ isDeleted: false });
        if (!resume) {
            throw new Error('Resume not found');
        }
        return resume;
    } catch (error) {
        console.error('Error fetching resume:', error);
        throw new Error('Error fetching resume: ' + error.message);
    }
}

const updateResume = async (id, resumeData, user) => {
    try {
        if (!id) throw new Error('Resume ID is required');
        const resume = await Resume.findOne({ _id: id, isDeleted: false });
        if (!resume) throw new Error('Resume not found');

        if (resumeData.status) {
            resume.status = resumeData.status;
            resume.history.push({
                status: resumeData.status,
                updatedBy: {
                    _id: user._id,
                    email: user.email
                }
            });
        }

        resume.updatedBy = {
            _id: user._id,
            email: user.email
        };
        resume.updatedAt = new Date();

        const updatedResume = await resume.save();
        return updatedResume;
    } catch (error) {
        console.error('Error updating resume:', error);
        throw new Error('Error updating resume: ' + error.message);
    }
};

const deleteResume = async (id, user) => {
    try {
        const resume = await Resume.findById(id).where({ isDeleted: false });
        if (!resume) {
            throw new Error('Resume not found');
        }
        const deletedResume = await softDeleteDocument(Resume, id, user);
        return deletedResume;
    } catch (error) {
        console.error('Error deleting resume:', error);
        throw new Error('Error deleting resume: ' + error.message);
    }
}

const getResumeByUser = async (user) => {
    try {
        const userId = user._id;
        if (!userId) throw new Error('User ID is required');
        const resumes = await Resume.find({ userId, isDeleted: false })
            .populate({ path: 'jobId', select: 'name' })
            .populate({ path: 'companyId', select: 'name' })
            .sort({ createdAt: -1 });

        if (!resumes) {
            throw new Error('Resumes not found');
        }
        return resumes;
    } catch (error) {
        console.error('Error fetching resumes by user:', error);
        throw new Error('Error fetching resumes by user: ' + error.message);
    }
}

module.exports = {
    createResume,
    getAllResumes,
    getResumeById,
    updateResume,
    deleteResume,
    getResumeByUser
}