const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'job-mail-service',
  brokers: ['localhost:9092'], // Không dùng 'kafka:9092' nếu không ở trong Docker network
});

module.exports = kafka;
