const createKafka = require('./config');

const createRetryConsumer = async (groupId, clientId, eachMessageHandler) => {
  const kafka = createKafka(clientId);
  const consumer = kafka.consumer({ groupId });

  await consumer.connect();
  await consumer.subscribe({ topic: 'retry-2m', fromBeginning: false });

  await consumer.run({
    autoCommit: false,
    eachMessage: async ({ topic, partition, message }) => {
      try {
        const { userId, retryAt } = JSON.parse(message.value.toString());
        const now = Date.now();
        const delay = retryAt + 2 * 60 * 1000 - now;

        if (delay > 0) {
          console.log(`🕒 Chờ ${Math.ceil(delay / 1000)}s trước khi retry user ${userId}`);
          setTimeout(async () => {
            await eachMessageHandler({ topic, partition, message });
            await consumer.commitOffsets([{ topic, partition, offset: (parseInt(message.offset) + 1).toString() }]);
            console.log(`✅ Retry user ${userId}`);
          }, delay);
        } else {
          await eachMessageHandler({ userId });
          await consumer.commitOffsets([{ topic, partition, offset: (parseInt(message.offset) + 1).toString() }]);
          console.log(`✅ Retry ngay user ${userId}`);
        }
      } catch (err) {
        console.error('❌ Lỗi xử lý message Kafka (retry):', err.message);
      }
    }
  });
};

module.exports = createRetryConsumer;
