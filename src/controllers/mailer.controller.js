const mailerService = require('../services/mailer.service');

const mailerController = {
    sendMail: async (req, res) => {
        try {
            const user = req.user;
            const result = await mailerService.sendEmail(user);
            return res.status(200).json({ message: 'Email sent successfully', result });
        } catch (error) {
            return res.status(500).json({ message: 'Failed to send email', error: error.message });
        }
    },
};

module.exports = mailerController;