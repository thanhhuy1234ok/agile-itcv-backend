const { chooseUploader } = require('../middlewares/upload.middleware.js');
const express = require('express');
const { uploadFile } = require('../controllers/upload.controller.js');  
const authMiddleware = require('../middlewares/auth.middleware.js');
const fileRouter = express.Router();

fileRouter.use(authMiddleware);

fileRouter.post('/upload', chooseUploader, uploadFile);  

module.exports = fileRouter;