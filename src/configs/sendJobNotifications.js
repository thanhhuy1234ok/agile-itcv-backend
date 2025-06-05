const cron = require('node-cron');
const User = require('../schema/user.schema');
const Job = require('../schema/jobs.schema');
const JobNotification = require('../schema/jobNotification.schema');
const { sendMail } = require('./mailer');

const jobMatchesUserSkills = (jobSkills = [], userSkills = []) =>
  jobSkills.some(skill => userSkills.includes(skill));

const sendJobNotificationsCron = () => {
    
  cron.schedule('* * * * *', async () => {
    try {
      console.log('🔔 Bắt đầu kiểm tra job phù hợp để gửi mail...');

      const users = await User.find({
        isDeleted: false,
        skills: { $exists: true, $ne: [] },
        'role.name': 'NORMAL USER'
      });

      const jobs = await Job.find({
        isActive: true,
        endDate: { $gte: new Date() },
        isDeleted: false
      });

      for (const user of users) {
        try {
          if (!user.email) {
            console.warn(`⚠️ User ${user._id} không có email, bỏ qua`);
            continue;
          }

          const userSkills = user.skills || [];
          const matchedJobs = jobs.filter(job =>
            jobMatchesUserSkills(job.skill || [], userSkills)  
          );

          if (matchedJobs.length === 0) continue; 

          for (const job of matchedJobs) {
            try {
              const alreadyNotified = await JobNotification.findOne({
                userId: user._id,
                jobId: job._id,
              });

              if (!alreadyNotified) {
                console.log(`📤 Gửi mail job "${job.name}" tới user "${user.email}"`);

                await sendMail(
                  user.email,
                  `Cơ hội việc làm phù hợp: ${job.name}`,
                  'jobNotification',
                  {
                    userName: user.name || 'Ứng viên',
                    jobName: job.name,
                    jobDescription: job.description,
                    companyName: job.companyId?.name || 'Công ty',
                    location: job.location,
                    salary: job.salary,
                    startDate: job.startDate?.toLocaleDateString() || '',
                    endDate: job.endDate?.toLocaleDateString() || '',
                  }
                );

                await JobNotification.create({
                  userId: user._id,
                  jobId: job._id,
                });

                console.log(`✅ Đã gửi mail "${job.name}" đến user "${user.email}"`);
              }
            } catch (jobErr) {
              console.error(`❌ Lỗi khi xử lý job ${job._id} cho user ${user._id}:`, jobErr);
            }
          }
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
