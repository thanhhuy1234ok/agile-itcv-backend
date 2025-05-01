const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware.js');
const jobController = require('../controllers/job.controller.js');
const jobRouter = express.Router();

jobRouter.use(authMiddleware);
jobRouter.post('/', jobController.createNewJob);
jobRouter.get('/', jobController.getAllJobs);
jobRouter.get('/:id', jobController.getJobById);
jobRouter.put('/:id', jobController.updateJob);
jobRouter.delete('/:id', jobController.deleteJob);

module.exports = jobRouter;