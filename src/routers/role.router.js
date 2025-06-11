const express = require('express');
const roleController = require('../controllers/role.controller.js');
const roleRouter = express.Router();
const authMiddleware = require('../middlewares/auth.middleware.js');
const checkPermission = require('../middlewares/permission.middleware');

roleRouter.use(authMiddleware);
roleRouter.use(checkPermission)

roleRouter.post('/', roleController.createRole);
roleRouter.get('/', roleController.getAllRoles);
roleRouter.get('/:id', roleController.getRoleById);
roleRouter.put('/:id', roleController.updateRole);
roleRouter.delete('/:id', roleController.deleteRole);

module.exports = roleRouter;