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

const sendToKafka = async (topic, dataArray) => {
  await connectProducer();

  const messages = dataArray.map(data => ({
    value: JSON.stringify(data)
  }));

  await producer.send({
    topic,
    messages,
  });
};

const sendUserToKafka = async (userIds) => {
  const payload = userIds.map(userId => ({ userId }));
  return sendToKafka('send-email', payload);
};

const sendToRetryTopic = async (payload) => {
  const dataArray = Array.isArray(payload) ? payload : [payload];
  return sendToKafka('retry-2m', dataArray);
};

process.on('SIGINT', async () => {
  await producer.disconnect();
  process.exit();
});

module.exports = {
  sendUserToKafka,
  sendToRetryTopic,
};
