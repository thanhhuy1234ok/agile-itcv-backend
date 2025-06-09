const JobNotification = require('../schema/jobNotification.schema');

const createJobNotificationService = async ({ userId, skills }) => {
  if (!skills || !Array.isArray(skills)) {
    throw new Error('Skills phải là một mảng.');
  }

  const existing = await JobNotification.findOne({ userId });
  if (existing) {
    throw new Error('JobNotification cho user này đã tồn tại.');
  }

  const jobNotification = await JobNotification.create({ userId, skills });
  return jobNotification;
};

const updateJobNotificationService = async (userId, skills) => {
  if (!skills || !Array.isArray(skills)) {
    throw new Error('Skills phải là một mảng.');
  }

  const jobNotification = await JobNotification.findOneAndUpdate(
    { userId },
    { skills },
    { new: true }
  );

  if (!jobNotification) {
    throw new Error('Không tìm thấy JobNotification để cập nhật.');
  }

  return jobNotification;
};

module.exports = {
  createJobNotificationService,
  updateJobNotificationService,
};
