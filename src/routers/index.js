const express = require('express');
const userRoutes = require('./user.router.js');
const authRoutes = require('./auth.router.js')
const router = express.Router();

// Định nghĩa prefix cho từng nhóm route
router.use('/users', userRoutes);
router.use('/auth', authRoutes)

module.exports =  router;
 