const { createConsumer } = require('../kafka/consumer');
const { sendMail } = require('./mailer');

const startJobNotificationConsumer = async () => {
    const kafkaConsumer = createConsumer('job-mail-group');
  await kafkaConsumer.connect();
  await kafkaConsumer.subscribe({ topic: 'job_notifications', fromBeginning: false });

  await kafkaConsumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      try {
        const data = JSON.parse(message.value.toString());

        console.log(`📥 Nhận message từ Kafka (topic: ${topic}, partition: ${partition})`);

        console.log(`📨 Đang gửi email cho: ${data.email}`);

        await sendMail(
          data.email,
          `Cơ hội việc làm phù hợp dành cho bạn (${data.jobs.length} việc làm)`,
          'jobNotificationAggregate',
          {
            userName: data.userName,
            jobs: data.jobs,
          }
        );

        console.log(`✅ Đã gửi mail tới ${data.email}`);
      } catch (err) {
        console.error('❌ Lỗi khi gửi mail từ Kafka consumer:', err);
      }
    },
  });
};

module.exports = startJobNotificationConsumer;
