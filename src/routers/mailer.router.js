const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware.js');
const mailerController = require('../controllers/mailer.controller.js');
const mailer = express.Router();

mailer.use(authMiddleware);
mailer.post('/send-mail', mailerController.sendMail);

module.exports = mailer;