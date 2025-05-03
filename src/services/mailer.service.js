// services/sendMail.service.js
const { sendMail } = require('../configs/mailer');

const sendWelcomeEmail = async (userEmail, userName) => {
    await sendMail(userEmail, 'Chào mừng bạn đến với hệ thống', 'email', {
        name: userName,
        verificationLink: `http://localhost:3000/verify?email=${userEmail}`
    });
};

const sendEmail = async(user) =>{
    const {email, name} = user;
    const subject = 'Chào mừng bạn đến với hệ thống';
    const templateName = 'email';
    const context = {
        name: name,
        verificationLink: `http://localhost:3000/verify?email=${email}`
    };

    try {
        await sendMail(email, subject, templateName, context);
        console.log('✅ Email đã gửi thành công!');
    } catch (error) {
        console.error('❌ Gửi email thất bại:', error.message);
    }
}

module.exports = { sendWelcomeEmail, sendEmail };
