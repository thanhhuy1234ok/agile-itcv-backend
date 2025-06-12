const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'job-app',
  brokers: ['localhost:9092'], 
});

const kafkaProducer = kafka.producer();

const connectProducer = async () => {
  await kafkaProducer.connect();
  console.log('✅ Kafka Producer connected');
};

module.exports = {
  kafkaProducer,
  connectProducer,
};
