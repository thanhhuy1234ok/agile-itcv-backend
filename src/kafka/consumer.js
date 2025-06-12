const kafka = require('./kafka.config');
const { sendMail } = require('../configs/mailer');

const consumer = kafka.consumer({ groupId: 'job-mail-group' });

const runConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'job-mail-topic', fromBeginning: false });

  console.log('📥 Consumer đang lắng nghe topic job-mail-topic...');

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      try {
        const user = JSON.parse(message.value.toString());

        if (!user.email || !Array.isArray(user.jobs) || user.jobs.length === 0) {
          console.warn('⚠️ Dữ liệu không hợp lệ, bỏ qua');
          return;
        }

        await sendMail(
          user.email,
          `Cơ hội việc làm phù hợp dành cho bạn (${user.jobs.length} việc làm)`,
          'jobNotificationAggregate',
          { userName: user.userName, jobs: user.jobs }
        );

        console.log(`✅ Đã gửi mail tới ${user.email}`);
      } catch (err) {
        console.error('❌ Lỗi xử lý message:', err);
      }
    },
  });
};

module.exports = runConsumer;
