const express = require('express');
const userController = require('../controllers/user.controller.js');
const userRouter = express.Router();

userRouter.get('/', userController.getAllUsers);

module.exports = userRouter;