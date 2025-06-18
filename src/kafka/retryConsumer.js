const createKafka = require('./config');
const { sendToRetryTopic } = require('../kafka/producer');

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const MAX_RETRIES = 3;

const createRetryConsumer = async (groupId, clientId, eachMessageHandler) => {
  const kafka = createKafka(clientId);
  const consumer = kafka.consumer({ groupId });

  await consumer.connect();
  await consumer.subscribe({ topic: 'retry-2m', fromBeginning: false });

  await consumer.run({
    autoCommit: false,
    eachMessage: async ({ topic, partition, message }) => {
      try {
        const { userId, retryAt, retryCount } = JSON.parse(message.value.toString());
        const now = Date.now();
        const delay = retryAt + 10 * 1000 - now; 

        if (retryCount > MAX_RETRIES) {
          console.warn(`⛔ Dừng retry user ${userId} sau ${retryCount} lần thất bại`);
        } else {
          if (delay > 0) {
            console.log(`🕒 Chờ ${Math.ceil(delay / 1000)}s trước khi retry user ${userId}`);
            await sleep(delay);
          }

          try {
            await eachMessageHandler({ topic, partition, message });
            console.log(`✅ Retry lần ${retryCount} thành công cho user ${userId}`);
          } catch (err) {
            console.error('❌ Lỗi xử lý Kafka message (retry):', err.message);

            if (retryCount < MAX_RETRIES) {
              await sendToRetryTopic({
                userId,
                retryCount: retryCount + 1,
                retryAt: Date.now()
              });
              console.log(`🔁 Retry tiếp theo (lần ${retryCount + 1}) sẽ được lên lịch cho user ${userId}`);
            } else {
              console.warn(`⛔ Dừng retry user ${userId} sau ${retryCount} lần thất bại`);
            }
          }
        }

        await consumer.commitOffsets([
          { topic, partition, offset: (parseInt(message.offset) + 1).toString() },
        ]);
      } catch (err) {
        console.error('⚠️ Không thể parse hoặc xử lý message:', err.message);
        await consumer.commitOffsets([
          { topic, partition, offset: (parseInt(message.offset) + 1).toString() },
        ]);
      }
    }
  });
};

module.exports = createRetryConsumer;
