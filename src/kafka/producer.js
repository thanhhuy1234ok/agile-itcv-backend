const kafka = require('./kafka.config');

const producer = kafka.producer();

const connectProducer = async () => {
  try {
    await producer.connect();
    console.log('✅ Kafka producer connected');
  } catch (err) {
    console.error('❌ Error connecting producer:', err);
  }
};

module.exports = {
  producer,
  connectProducer,
};
