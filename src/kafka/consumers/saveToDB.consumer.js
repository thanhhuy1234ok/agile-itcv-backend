const runBaseConsumer = require('../baseConsumer');
const { createResume } = require('../../services/resume.service');

const run = () => runBaseConsumer({
  topic: 'cv_applied',
  groupId: 'resume-group',
  handler: createResume
});

module.exports = run;
