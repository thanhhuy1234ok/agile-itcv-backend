const cron = require('node-cron');
const User = require('../schema/user.schema');
const Job = require('../schema/jobs.schema');
const JobNotification = require('../schema/jobNotification.schema');
const { formatDate } = require('../utils/formater.dayjs');
const { sendMail } = require('./mailer');

const sendJobNotificationsCron = () => {
  cron.schedule('* * * * *', async () => {
    try {
      console.log('🔔 Bắt đầu kiểm tra job phù hợp để gửi mail...');

      const users = await User.find({
        isDeleted: false,
        'role.name': 'NORMAL USER',
      });

      const jobs = await Job.find({
        isActive: true,
        endDate: { $gte: new Date() },
        isDeleted: false,
      });

      for (const user of users) {
        try {
          if (!user.email) {
            console.warn(`⚠️ User ${user._id} không có email, bỏ qua`);
            continue;
          }

          const jobNotification = await JobNotification.findOne({ userId: user._id });

          if (!jobNotification || jobNotification.emailNotificationsEnabled === false) {
            console.log(`⚠️ User ${user._id} đã tắt gửi mail, bỏ qua.`);
            continue;
          }

          if (!Array.isArray(jobNotification.skills) || jobNotification.skills.length === 0) {
            console.log(`⚠️ User ${user._id} không có skills trong JobNotification, bỏ qua`);
            continue;
          }

          const userSkills = jobNotification.skills;

          const matchedJobs = jobs.filter(job =>
            job.skill && job.skill.some(skill => userSkills.includes(skill))
          );

          if (matchedJobs.length === 0) {
            console.log(`ℹ️ Không tìm thấy job phù hợp cho user ${user._id}, bỏ qua.`);
            continue;
          }

          const formattedJobs = matchedJobs.map(job => ({
            _id: job._id,
            name: job.name,
            location: job.location,
            salary: job.salary,
            description: job.description?.substring(0, 150) + '...',
            endDate: formatDate(job.endDate) || '',
            companyName: job.companyId?.name || 'Công ty',
          }));

          console.log(`📤 Gửi mail tới user "${user.email}" với ${formattedJobs.length} job`);

          await sendMail(
            user.email,
            `Cơ hội việc làm phù hợp dành cho bạn (${formattedJobs.length} việc làm)`,
            'jobNotificationAggregate',
            {
              userName: user.name || 'Ứng viên',
              jobs: formattedJobs,
            }
          );

          console.log(`✅ Đã gửi mail đến user "${user.email}"`);
        } catch (userErr) {
          console.error(`❌ Lỗi khi xử lý user ${user._id}:`, userErr);
        }
      }

      console.log('✅ Hoàn thành gửi mail job phù hợp cho user.');
    } catch (error) {
      console.error('❌ Lỗi trong cron job gửi mail:', error);
    }
  });
};

module.exports = sendJobNotificationsCron;
