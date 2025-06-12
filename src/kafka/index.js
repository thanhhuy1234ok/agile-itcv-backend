const runSaveToDB = require('./consumers/saveToDB.consumer');
const runSendMail = require('./consumers/startCvApplied.consumer');
const runSendMailNotification = require('./consumers/jobEmailNotification.consumer')
const { connectProducer } = require('./config.producer');

const startKafka = async () => {
  await connectProducer();
  runSaveToDB();
  runSendMail();
  runSendMailNotification();
};

module.exports = { startKafka };
