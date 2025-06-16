const createKafka = require('./config');
const { sendToRetryTopic } = require('../kafka/producer');

const commitOffset = async (consumer, topic, partition, offset) => {
  const offsetValue = (parseInt(offset) + 1).toString();
  await consumer.commitOffsets([{ topic, partition, offset: offsetValue }]);
  console.log(`✅ Đã commit offset ${offsetValue} cho partition ${partition}`);
};

const handleMessageError = async (consumer, topic, partition, message, error) => {
  console.error('❌ Lỗi xử lý message Kafka:', error.message);
  try {
    const { userId } = JSON.parse(message.value.toString());
    if (userId) {
      await sendToRetryTopic(userId);
      await commitOffset(consumer, topic, partition, message.offset);
      console.log(`🔁 Đã gửi userId ${userId} vào retry-2m`);
    } else {
      console.warn('⚠️ Không có userId để retry');
    }
  } catch (parseErr) {
    console.error('⚠️ Không thể parse message value:', parseErr.message);
  }
};

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
        await commitOffset(consumer, topic, partition, message.offset);
      } catch (err) {
        await handleMessageError(consumer, topic, partition, message, err);
      }
    },
  });
};

module.exports = createConsumer;
