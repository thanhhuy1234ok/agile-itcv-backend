const createKafka = require('./config');
const kafka = createKafka('job-email-service');
const producer = kafka.producer();

let isConnected = false;

const sendUserToKafka = async (userId) => {
  if (!isConnected) {
    await producer.connect();
    isConnected = true;
  }

  await producer.send({
    topic: 'send-email',
    messages: [
      {
        value: JSON.stringify({ userId }),
      },
    ],
  });
};

process.on('SIGINT', async () => {
  await producer.disconnect();
  process.exit();
});

module.exports = sendUserToKafka;
