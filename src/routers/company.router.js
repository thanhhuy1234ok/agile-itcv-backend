const express = require('express');
const companyController = require('../controllers/company.controller.js');
const authMiddleware = require('../middlewares/auth.middleware.js');
const companyRouter = express.Router();

companyRouter.use(authMiddleware);

companyRouter.post('/',companyController.createCompany);
companyRouter.get('/', companyController.getAllCompanies);
companyRouter.get('/:id', companyController.getCompanyById);
companyRouter.put('/:id', companyController.updateCompany);
companyRouter.delete('/:id', companyController.deleteCompany);

module.exports = companyRouter;