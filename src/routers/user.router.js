const express = require('express');
const userController = require('../controllers/user.controller.js');
const authMiddleware = require('../middlewares/auth.middleware.js');
const checkPermission = require('../middlewares/permission.middleware');

const userRouter = express.Router();

userRouter.use(authMiddleware)
userRouter.use(checkPermission)

userRouter.get('/userDetail/:id', userController.getUserById);
userRouter.get('/allUsers', userController.getAllUsers);
userRouter.post('/', userController.createUser);
userRouter.put('/updateUser/:id', userController.updateUser);
userRouter.delete('/deleteUser/:id', userController.deleteUser);

module.exports = userRouter;
