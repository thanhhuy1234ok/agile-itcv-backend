const { sendMail } = require('../configs/mailer');
const JobModel = require('../schema/jobs.schema'); 

const cvAppliedHandler = async (data) => {
  const { email, userName, jobId } = data;

  if (!email || !userName || !jobId) {
    console.warn("⚠️ Missing required data:", data);
    return;
  }

  const job = await JobModel.findById(jobId).lean(); 

  if (!job) {
    console.warn("⚠️ Không tìm thấy công việc với jobId:", jobId);
    return;
  }

  const jobName = job.name || 'Công việc không xác định';

  await sendMail(
    email,
    'Thông báo ứng tuyển thành công',
    'apply-success',
    {
      name: userName,
      jobName, 
    }
  );
};

const jobNotificationHandler = async (data) => {
  const { email, userName, jobs } = data;

  if (!email || !userName || !Array.isArray(jobs) || jobs.length === 0) {
    console.warn("⚠️ Dữ liệu không hợp lệ:", data);
    return;
  }

  await sendMail(
    email,
    'Gợi ý việc làm phù hợp dành cho bạn',
    'jobNotificationAggregate', 
    {
      name: userName,
      jobs,
    }
  );
};

module.exports = {
  cvAppliedHandler,
  jobNotificationHandler,
};

