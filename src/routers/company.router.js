const express = require('express');
const companyController = require('../controllers/company.controller.js');
const authMiddleware = require('../middlewares/auth.middleware.js');
const checkPermission = require('../middlewares/permission.middleware.js')
const companyRouter = express.Router();

// companyRouter.use(authMiddleware);

companyRouter.post('/', authMiddleware,companyController.createCompany);
companyRouter.get('/', companyController.getAllCompanies);
companyRouter.get('/:id', authMiddleware, checkPermission, companyController.getCompanyById);
companyRouter.put('/:id', authMiddleware, companyController.updateCompany);
companyRouter.delete('/:id', authMiddleware, companyController.deleteCompany);

module.exports = companyRouter;