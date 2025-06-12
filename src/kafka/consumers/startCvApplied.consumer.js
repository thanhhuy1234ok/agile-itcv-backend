const runBaseConsumer = require('../baseConsumer');
const { cvAppliedHandler } = require('../../services/cvAppliedService');

const run = () => runBaseConsumer({
  topic: 'cv_applied',
  groupId: 'cv-applied-email-group',
  handler: cvAppliedHandler
});

module.exports = run;
