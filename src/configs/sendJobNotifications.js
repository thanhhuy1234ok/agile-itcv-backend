const cron = require('node-cron');
const User = require('../schema/user.schema');
const Job = require('../schema/jobs.schema');
const JobNotification = require('../schema/jobNotification.schema');
const { formatDate } = require('../utils/formater.dayjs');
const { producer } = require('../kafka/producer');

const sendJobNotificationsCron = () => {
  cron.schedule('* * * * *', async () => {
    try {
      console.log('🔔 Bắt đầu kiểm tra job phù hợp để gửi vào Kafka...');

      const users = await User.find({
        isDeleted: false,
        'role.name': 'NORMAL USER',
      });

      const jobs = await Job.find({
        isActive: true,
        endDate: { $gte: new Date() },
        isDeleted: false,
      });

      const messages = [];

      for (const user of users) {
        try {
          if (!user.email) continue;

          const jobNotification = await JobNotification.findOne({ userId: user._id });
          if (!jobNotification?.emailNotificationsEnabled) continue;

          const userSkills = jobNotification.skills;
          if (!Array.isArray(userSkills) || userSkills.length === 0) continue;

          const matchedJobs = jobs.filter(job =>
            job.skill && job.skill.some(skill => userSkills.includes(skill))
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

          messages.push({
            key: user.email, // optional, để Kafka phân phối đều theo email
            value: JSON.stringify({
              email: user.email,
              userName: user.name || 'Ứng viên',
              jobs: formattedJobs,
            }),
          });
        } catch (userErr) {
          console.error(`❌ Lỗi khi xử lý user ${user._id}:`, userErr);
        }
      }

      if (messages.length > 0) {
        await producer.send({
          topic: 'job-mail-topic',
          messages,
        });
        console.log(`📤 Đã đẩy ${messages.length} message (user) vào Kafka.`);
      } else {
        console.log('ℹ️ Không có user nào phù hợp để gửi.');
      }

    } catch (error) {
      console.error('❌ Cron lỗi:', error);
    }
  });
};

module.exports = sendJobNotificationsCron;
