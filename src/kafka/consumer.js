const createKafka = require('./config');

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
        //đẩy lỗi đó vào topic khác để xử lý lỗi sau
      }
    },
  });
};

module.exports = createConsumer;
