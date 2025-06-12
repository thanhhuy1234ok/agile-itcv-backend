const runBaseConsumer = require('../baseConsumer');
const { jobNotificationHandler } = require('../../services/cvAppliedService');

const run = () =>runBaseConsumer({
    topic: 'job_notifications',
    groupId: 'job_notification_group',
    handler: jobNotificationHandler,
})

module.exports = run;



