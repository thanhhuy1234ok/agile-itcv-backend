const createKafka = require('./config');
const { sendToRetryTopic } = require('../kafka/producer');

// Hàm xử lý lỗi message và gửi sang retry-2m với retryCount = 1
const handleMessageError = async (message, error) => {
  console.error('❌ Lỗi xử lý message Kafka:', error.message);
  try {
    const { userId } = JSON.parse(message.value.toString());
    if (userId) {
      const retryPayload = {
        userId,
        retryCount: 1,
        retryAt: Date.now()
      };
      await sendToRetryTopic(retryPayload);
      console.log(`🔁 Đã gửi userId ${userId} vào retry-2m (retryCount = 1)`);
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

  consumer.on(consumer.events.GROUP_JOIN, (e) => {
    console.log(`🔁 [GROUP_JOIN] ${clientId} đã join group ${groupId} với memberId: ${e.payload.memberId}`);
  });

  consumer.on(consumer.events.REBALANCING, () => {
    console.warn(`⚠️ [REBALANCING] Consumer ${clientId} đang rebalance...`);
  });

  await consumer.subscribe({ topic: 'send-email', fromBeginning: false });

  await consumer.run({
    autoCommit: false,
    eachBatchAutoResolve: false,
    eachBatch: async ({
      batch,
      resolveOffset,
      heartbeat,
      commitOffsetsIfNecessary,
      isRunning,
      isStale
    }) => {
      const { topic, partition, messages } = batch;

      if (!isRunning() || isStale()) return;

      console.log(`📦 Partition ${partition} nhận được ${messages.length} message(s)`);

      const committed = [];

      for (const message of messages) {
        if (!isRunning() || isStale()) break;

        try {
          await eachMessageHandler({ topic, partition, message });
          resolveOffset(message.offset);
          console.log(`✅ Đã xử lý message offset ${message.offset} từ partition ${partition}`);
        } catch (err) {
          console.error(`❌ Lỗi xử lý message offset ${message.offset}:`, err.message);
          await handleMessageError(message, err); 
          resolveOffset(message.offset); 
        }

        committed.push(parseInt(message.offset) + 1);
      }

      await commitOffsetsIfNecessary();
      await heartbeat();
      console.log(`📬 Đã commit offsets [${committed.join(', ')}] cho partition ${partition}`);
    }
  });
};

module.exports = createConsumer;
