const express = require('express');
const userController = require('../controllers/user.controller.js');
const authMiddleware = require('../middlewares/auth.middleware.js');
// const checkRole = require('../middlewares/auth.middleware.js') 
const userRouter = express.Router();

userRouter.get('/allUsers', userController.getAllUsers);
userRouter.put('/updateUser', authMiddleware, userController.updateUser);
userRouter.get('/userDetail/:id', userController.getUserById);

module.exports = userRouter;