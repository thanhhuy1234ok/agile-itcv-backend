const express = require('express');
const roleController = require('../controllers/role.controller.js');
const roleRouter = express.Router();
const authMiddleware = require('../middlewares/auth.middleware.js');

roleRouter.use(authMiddleware);

roleRouter.post('/', roleController.createRole);
roleRouter.get('/', roleController.getAllRoles);
roleRouter.get('/:id', roleController.getRoleById);

module.exports = roleRouter;