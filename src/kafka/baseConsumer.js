const { createConsumer } = require('./config.consumer');

const runBaseConsumer = async ({ topic, groupId, handler }) => {
  const consumer = createConsumer(groupId);
  await consumer.connect();
  
  await consumer.subscribe({ topic, fromBeginning: false });
  
  await consumer.run({
    eachMessage: async ({ message, partition }) => {
      try {
        const data = JSON.parse(message.value.toString());

        await handler(data);

      } catch (err) {
        console.error(`❌ Error processing message from topic "${topic}":`, err.message);
      }
    },
  });

  console.log(`🚀 Consumer is now running for topic: ${topic}`);
};

module.exports = runBaseConsumer;
