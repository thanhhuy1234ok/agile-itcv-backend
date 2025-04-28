const express = require('express');
const companyController = require('../controllers/company.controller.js');
const authMiddleware = require('../middlewares/auth.middleware.js');
const companyRouter = express.Router();

companyRouter.use(authMiddleware);

// Route để tạo công ty mới
companyRouter.post('/',companyController.createCompany);
companyRouter.get('/', companyController.getAllCompanies);

module.exports = companyRouter;