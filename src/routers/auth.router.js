const express = require('express');
const authController = require('../controllers/auth.controller')
const authMiddleware = require('../middlewares/auth.middleware.js');
const authRouter = express.Router();

authRouter.post('/register', authController.create);
authRouter.post('/login', authController.login)
authRouter.get('/refresh-token', authController.refreshAccessToken)
authRouter.post('/logout',authMiddleware ,authController.logout)

module.exports = authRouter;