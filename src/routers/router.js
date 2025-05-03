const express = require('express');
const userRoutes = require('./user.router.js');
const authRoutes = require('./auth.router.js')
const companyRoutes = require('./company.router.js');
const roleRoutes = require('./role.router.js');
const jobRoutes = require('./job.router.js');
const resumeRoutes = require('./resume.router.js');
const fileRouter = require('./files.router.js');
const mailerRouter = require('./mailer.router.js');
const router = express.Router();

router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/companies', companyRoutes);
router.use('/roles', roleRoutes);
router.use('/jobs', jobRoutes);
router.use('/resumes', resumeRoutes);
router.use('/files', fileRouter);
router.use('/mailer', mailerRouter);

module.exports =  router;
 