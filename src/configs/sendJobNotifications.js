const cron = require('node-cron');
const User = require('../schema/user.schema');
const Job = require('../schema/jobs.schema');
const JobNotification = require('../schema/jobNotification.schema');
const { formatDate } = require('../utils/formater.dayjs');
const { kafkaProducer } = require('../kafka/producer');

const sendJobNotificationsCron = () => {
  cron.schedule('* * * * *', async () => {
    try {
      console.log('🔔 Bắt đầu kiểm tra job phù hợp để gửi mail...');

      const users = await User.find({ isDeleted: false, 'role.name': 'NORMAL USER' });
      const jobs = await Job.find({
        isActive: true,
        endDate: { $gte: new Date() },
        isDeleted: false,
      });

      for (const user of users) {
        try {
          if (!user.email) continue;

          const jobNotification = await JobNotification.findOne({ userId: user._id });
          if (!jobNotification?.emailNotificationsEnabled || !Array.isArray(jobNotification.skills)) continue;

          const userSkills = jobNotification.skills;
          const matchedJobs = jobs.filter(job =>
            job.skill?.some(skill => userSkills.includes(skill))
          );

          if (matchedJobs.length === 0) continue;

          const formattedJobs = matchedJobs.map(job => ({
            _id: job._id,
            name: job.name,
            location: job.location,
            salary: job.salary,
            description: job.description?.substring(0, 150) + '...',
            endDate: formatDate(job.endDate) || '',
            companyName: job.companyId?.name || 'Công ty',
          }));

          await kafkaProducer.send({
            topic: 'job_notifications',
            messages: [{
              key: user._id.toString(),
              value: JSON.stringify({
                email: user.email,
                userName: user.name || 'Ứng viên',
                jobs: formattedJobs,
              }),
            }],
          });

          console.log(`📤 Gửi Kafka message cho ${user.email}`);
        } catch (userErr) {
          console.error(`❌ Lỗi khi xử lý user ${user._id}:`, userErr);
        }
      }

      console.log('✅ Đã gửi Kafka messages cho các user phù hợp.');
    } catch (error) {
      console.error('❌ Lỗi trong cron job:', error);
    }
  });
};

module.exports = sendJobNotificationsCron;
