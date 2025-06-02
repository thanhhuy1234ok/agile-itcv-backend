const express = require('express');
const userController = require('../controllers/user.controller.js');
const authMiddleware = require('../middlewares/auth.middleware.js');
const checkPermission = require('../middlewares/permission.middleware');

const userRouter = express.Router();

// Route public 
userRouter.get('/userDetail/:id', userController.getUserById);

// Các route cần auth và kiểm tra permission
userRouter.get('/allUsers',authMiddleware, checkPermission, userController.getAllUsers);
userRouter.post('/', authMiddleware, checkPermission, userController.createUser);
userRouter.put('/updateUser/:id', authMiddleware, checkPermission, userController.updateUser);
userRouter.delete('/deleteUser/:id', authMiddleware, checkPermission, userController.deleteUser);

module.exports = userRouter;
