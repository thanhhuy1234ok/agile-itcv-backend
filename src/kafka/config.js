const { Kafka, logLevel } = require('kafkajs');

const createKafka = (clientId) =>
  new Kafka({
    clientId,
    brokers: ['localhost:9092'],
    logLevel: logLevel.NOTHING
  });

module.exports = createKafka;
