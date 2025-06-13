const cron = require('node-cron');
const User = require('../schema/user.schema');
const sendUserToKafka = require('../kafka/producer');

const sendJobNotificationsCron = () => {
  cron.schedule('* * * * *', async () => {
    const users = await User.find({
      isDeleted: false,
      'role.name': 'NORMAL USER',
    });

    for (const user of users) {
      if (!user.email) continue;
      await sendUserToKafka(user._id);
    }

    console.log('📤 Đã đẩy toàn bộ user vào Kafka topic `send-email`');
  });
};

module.exports = sendJobNotificationsCron;
