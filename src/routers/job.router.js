const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware.js');
const jobController = require('../controllers/job.controller.js');
const jobRouter = express.Router();

// jobRouter.use(authMiddleware);
jobRouter.post('/', authMiddleware, jobController.createNewJob);
jobRouter.get('/', jobController.getAllJobs);
jobRouter.get('/:id', jobController.getJobById);
jobRouter.put('/:id', authMiddleware, jobController.updateJob);
jobRouter.delete('/:id', authMiddleware, jobController.deleteJob);

module.exports = jobRouter;