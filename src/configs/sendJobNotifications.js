const cron = require('node-cron');
const User = require('../schema/user.schema');
const { sendUserToKafka } = require('../kafka/producer');

const sendJobNotificationsCron = () => {
  cron.schedule('* * * * *', async () => {
    try {
      const users = await User.find({
        isDeleted: false,
        'role.name': 'NORMAL USER',
      });

      const userIds = users.map(user => user._id);

      if (userIds.length > 0) {
        await sendUserToKafka(userIds); // Gửi 1 batch
        console.log(`📤 Đã đẩy ${userIds.length} user vào Kafka topic 'send-email' (1 batch)`);
      }
    } catch (err) {
      console.error('❌ Lỗi khi gửi user vào Kafka:', err.message);
    }
  });
};


module.exports = sendJobNotificationsCron;
