const createKafka = require('./config');
const kafka = createKafka('job-email-service');
const producer = kafka.producer();

let isConnected = false;

const connectProducer = async () => {
  if (!isConnected) {
    await producer.connect();
    isConnected = true;
  }
};

const sendToKafka = async (topic, data) => {
  await connectProducer();

  await producer.send({
    topic,
    messages: [{ value: JSON.stringify(data) }],
  });
};

const sendUserToKafka = async (userId) => {
  return sendToKafka('send-email', { userId });
};

const sendToRetryTopic = async (userId) => {
  return sendToKafka('retry-2m', { userId, retryAt: Date.now() });
};

process.on('SIGINT', async () => {
  await producer.disconnect();
  process.exit();
});

module.exports = {
  sendUserToKafka,
  sendToRetryTopic,
};
