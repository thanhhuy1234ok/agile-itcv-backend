const { Kafka } = require('kafkajs');
const kafka = new Kafka({ clientId: 'job-app', brokers: ['localhost:9092'] });

const createConsumer = (groupId) => kafka.consumer({ groupId });

module.exports = { createConsumer };
