const createKafka = require('./config');
const createConsumer = async (groupId, clientId, eachMessageHandler) => {
  const kafka = createKafka(clientId); 
  const consumer = kafka.consumer({ groupId });
  await consumer.connect();
  await consumer.subscribe({ topic: 'send-email', fromBeginning: false });
  await consumer.run({autoCommit:true, eachMessage: eachMessageHandler });
};

module.exports = createConsumer;
