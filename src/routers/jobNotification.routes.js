const express = require('express');
const jobNotificationRouter = express.Router();

const {
  createJobNotification,
  updateJobNotification,
} = require('../controllers/jobNotification.controller');

const authMiddleware = require('../middlewares/auth.middleware.js');

jobNotificationRouter.use(authMiddleware);

jobNotificationRouter.post('/', createJobNotification);

jobNotificationRouter.put('/', updateJobNotification);

module.exports = jobNotificationRouter;
