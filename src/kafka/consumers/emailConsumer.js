const createConsumer = require('../consumer');
const User = require('../../schema/user.schema');
const Job = require('../../schema/jobs.schema');
const JobNotification = require('../../schema/jobNotification.schema');
const { sendMail } = require('../../configs/mailer');
const { formatDate } = require('../../utils/formater.dayjs');

const runEmailConsumer = async (consumerName) => {
  await createConsumer('email-group', consumerName, async ({ message }) => {
    try {
      const { userId } = JSON.parse(message.value.toString());

      const user = await User.findById(userId);
      const jobNotification = await JobNotification.findOne({ userId });

      if (!user?.email || !jobNotification?.emailNotificationsEnabled) {
        throw new Error(`⚠️ Không gửi được mail cho user ${userId}: thiếu email hoặc chưa bật thông báo`);
      }

      const jobs = await Job.find({
        isActive: true,
        endDate: { $gte: new Date() },
        isDeleted: false,
      });

      const userSkills = jobNotification.skills || [];
      const matchedJobs = jobs.filter(job =>
        job.skill?.some(skill => userSkills.includes(skill))
      );

      if (matchedJobs.length === 0) {
        throw new Error(`📭 Không có job phù hợp với user ${userId}`);
      }

      const formattedJobs = matchedJobs.map(job => ({
        _id: job._id,
        name: job.name,
        location: job.location,
        salary: job.salary,
        description: job.description?.substring(0, 150) + '...',
        endDate: formatDate(job.endDate),
        companyName: job.companyId?.name || 'Công ty',
      }));

      await sendMail(
        user.email,
        `Cơ hội việc làm phù hợp dành cho bạn (${formattedJobs.length} việc làm)`,
        'jobNotificationAggregate',
        {
          userName: user.name || 'Ứng viên',
          jobs: formattedJobs,
        }
      );

      console.log(`✅ ${consumerName} đã gửi mail đến ${user.email}`);
    } catch (err) {
      throw err;
    }
  });
};

module.exports = runEmailConsumer;
