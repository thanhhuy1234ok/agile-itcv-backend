const express = require('express');
const userController = require('../controllers/user.controller.js');
const authMiddleware = require('../middlewares/auth.middleware.js');
// const checkRole = require('../middlewares/auth.middleware.js') 
const userRouter = express.Router();


userRouter.get('/allUsers', userController.getAllUsers);
userRouter.post('/',authMiddleware,userController.createUser);
userRouter.put('/updateUser/:id', authMiddleware, userController.updateUser);
userRouter.get('/userDetail/:id', userController.getUserById);
userRouter.delete('/deleteUser/:id', authMiddleware, userController.deleteUser);

module.exports = userRouter;