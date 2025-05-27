const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware.js');
const resumeController = require('../controllers/resume.controller.js');

const resumeRouter = express.Router();

// Middleware xác thực
resumeRouter.use(authMiddleware);

// CRUD resume
resumeRouter.post('/', resumeController.createResume);
resumeRouter.get('/', resumeController.getAllResumes);
resumeRouter.get('/by-user', resumeController.getResumeByUserId);
resumeRouter.get('/:id', resumeController.getResumeById);
resumeRouter.put('/:id', resumeController.updateResume);
resumeRouter.delete('/:id', resumeController.deleteResume);

// Tải file CV
resumeRouter.get('/:id/download', resumeController.downloadCv);

module.exports = resumeRouter;
