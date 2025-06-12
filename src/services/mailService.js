const { sendMail } = require('../configs/mailer');

const sendJobMail = async ({ email, name, jobs }) => {
  try {
    await sendMail(
      email,
      `Cơ hội việc làm phù hợp dành cho bạn (${jobs.length} việc làm)`,
      'jobNotificationAggregate',
      {
        userName: name || 'Ứng viên',
        jobs,
      }
    );
    console.log(`✅ Mail đã gửi tới ${email}`);
  } catch (error) {
    console.error(`❌ Lỗi gửi mail tới ${email}:`, error);
  }
};

module.exports = { sendJobMail };
