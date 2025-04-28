const express = require('express');
const userController = require('../controllers/user.controller.js');
// const checkRole = require('../middlewares/auth.middleware.js') 
const userRouter = express.Router();

userRouter.get('/allUsers', userController.getAllUsers);
userRouter.put('/updateUser', userController.updateUser);
userRouter.get('/userDetail', userController.getUserById);

module.exports = userRouter;