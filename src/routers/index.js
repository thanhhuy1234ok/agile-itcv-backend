const express = require('express');
const userRoutes = require('./user.router.js');
const router = express.Router();

// Định nghĩa prefix cho từng nhóm route
router.use('/users', userRoutes);

module.exports =  router;
 