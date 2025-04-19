const express = require('express');
const authController = require('../controllers/auth.controller')
const authRouter = express.Router();

authRouter.post('/register', authController.create);
authRouter.post('/login', authController.login)

module.exports = authRouter;