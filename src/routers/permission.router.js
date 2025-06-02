const express = require('express');
const permissionRouter = express.Router();
const permissionController = require('../controllers/permission.controller');
const authMiddleware = require('../middlewares/auth.middleware'); 
const checkPermission = require('../middlewares/permission.middleware')

permissionRouter.use(authMiddleware);
permissionRouter.use(checkPermission);

permissionRouter.post('/', permissionController.createPermission);
permissionRouter.post('/add-permission-to-role', permissionController.addPermissionToRole);

module.exports = permissionRouter;
