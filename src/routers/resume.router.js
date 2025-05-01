const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware.js');
const resumeController = require('../controllers/resume.controller.js');
const resumeRouter = express.Router();

resumeRouter.use(authMiddleware);
resumeRouter.post('/', resumeController.createResume);
resumeRouter.get('/', resumeController.getAllResumes);
resumeRouter.get('/by-user', resumeController.getResumeByUserId);
resumeRouter.get('/:id', resumeController.getResumeById);
resumeRouter.put('/:id', resumeController.updateResume);
resumeRouter.delete('/:id', resumeController.deleteResume);

module.exports = resumeRouter;