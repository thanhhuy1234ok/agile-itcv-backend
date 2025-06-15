const createKafka = require('./config');
const { sendToRetryTopic } = require('../kafka/producer'); 

const createConsumer = async (groupId, clientId, eachMessageHandler) => {
  const kafka = createKafka(clientId);
  const consumer = kafka.consumer({ groupId });

  await consumer.connect();
  await consumer.subscribe({ topic: 'send-email', fromBeginning: false });

  await consumer.run({
    autoCommit: false,
    eachMessage: async ({ topic, partition, message }) => {
      try {
        await eachMessageHandler({ topic, partition, message });

        const offsetValue = (parseInt(message.offset) + 1).toString();
        await consumer.commitOffsets([
          { topic, partition, offset: offsetValue },
        ]);
        console.log(`✅ Đã commit offset ${offsetValue} cho partition ${partition} của ${clientId}`);
      } catch (err) {
        console.error('❌ Lỗi xử lý message Kafka:', err.message);
        try {
          const { userId } = JSON.parse(message.value.toString());
          if (userId) {
            await sendToRetryTopic(userId);
            console.log(`🔁 Đã gửi userId ${userId} vào retry-2m`);
          } else {
            console.warn('⚠️ Không có userId để retry');
          }
        } catch (e) {
          console.error('⚠️ Không thể parse message value:', e.message);
        }
      }
    },
  });
};

module.exports = createConsumer;
