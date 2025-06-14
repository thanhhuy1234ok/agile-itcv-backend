const cron = require('node-cron');
const createKafka = require('./config');
const kafka = createKafka('lag-checker');

const groupId = 'email-group';
const topic = 'send-email';

const startCheckLagCron = () => {
  const checkLag = async () => {
    const admin = kafka.admin();
    await admin.connect();

    const topicOffsets = await admin.fetchTopicOffsets(topic);
    const consumerOffsets = await admin.fetchOffsets({ groupId, topic });

    console.log(`\n📊 [${new Date().toLocaleString()}] Lag hiện tại:`);

    topicOffsets.forEach(({ partition, offset: latestOffset }) => {
      const consumerPartitionOffset = consumerOffsets[0].partitions.find(p => p.partition === partition);
      const committedOffset = consumerPartitionOffset?.offset || '0';
      const lag = parseInt(latestOffset) - parseInt(committedOffset);

      console.log(`🧩 Partition ${partition}: Lag = ${lag}`);
    });

    await admin.disconnect();
  };

  cron.schedule('* * * * *', async () => {
    try {
      await checkLag();
    } catch (error) {
      console.error('❌ Lỗi khi kiểm tra lag:', error);
    }
  });
};

module.exports = startCheckLagCron;
