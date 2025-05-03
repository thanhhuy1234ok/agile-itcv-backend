const nodemailer = require('nodemailer');
const hbs = require('hbs');
const path = require('path');
const fs = require('fs');
const configs = require('../configs/env.config.js');
const mailOptions = require('../configs/mailer.option.js');
const mailerOption = require('../configs/mailer.option.js');

const transporter = nodemailer.createTransport({
    host: configs.mailer.service,
    secure: false,
    auth: {
        user: configs.mailer.user,
        pass: configs.mailer.pass,
    }
});


const sendMail = async (to, subject, templateName, context) => {
    try {
        const templatePath = path.join(__dirname, '../templates', `${templateName}.hbs`);
        const source = fs.readFileSync(templatePath, 'utf-8');
        const compiledTemplate = hbs.handlebars.compile(source);
        const htmlToSend = compiledTemplate(context);

        const mailOptions = await mailerOption(configs.mailer.user,to, subject, htmlToSend);

        const result = await transporter.sendMail(mailOptions);
        console.log('✅ Email đã gửi:', result.response);
        return result;
    } catch (error) {
        console.error('❌ Gửi email thất bại:', error.message);
        throw error;
    }
};

module.exports = {
    sendMail,
};
