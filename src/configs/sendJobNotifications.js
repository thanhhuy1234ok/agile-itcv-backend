const cron = require('node-cron');
const User = require('../schema/user.schema');
const Job = require('../schema/jobs.schema');
const JobNotification = require('../schema/jobNotification.schema');
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

          if (!jobNotification || !Array.isArray(jobNotification.skills) || jobNotification.skills.length === 0) {
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

          // Chuẩn bị dữ liệu cho email tổng hợp
          const jobListHtml = matchedJobs.map(job => `
            <div style="
                border: 1px solid #e0e0e0;
                border-radius: 8px;
                padding: 15px;
                margin-bottom: 20px;
                background-color: #ffffff;
                box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            ">
                <h3 style="color: #0056b3; margin-top: 0; margin-bottom: 10px;">${job.name}</h3>
                <p style="margin: 5px 0;"><strong>Công ty:</strong> ${job.companyId?.name || 'Công ty'}</p>
                <p style="margin: 5px 0;"><strong>Địa điểm:</strong> ${job.location}</p>
                <p style="margin: 5px 0;"><strong>Mức lương:</strong> ${job.salary}</p>
                <p style="margin: 5px 0;"><strong>Ngày kết thúc:</strong> ${job.endDate?.toLocaleDateString() || ''}</p>
                <p style="margin: 5px 0; font-size: 0.9em; color: #555;">${job.description.substring(0, 150)}...</p>
                <a href="[LINK_TO_JOB_DETAIL/${job._id}]" style="
                    display: inline-block;
                    background-color: #007bff;
                    color: #ffffff;
                    padding: 8px 15px;
                    border-radius: 5px;
                    text-decoration: none;
                    margin-top: 10px;
                    font-size: 0.9em;
                ">Xem chi tiết</a>
            </div>
        `).join('');

          console.log(`📤 Gửi mail tổng hợp các job tới user "${user.email}"`);

          await sendMail(
            user.email,
            `Cơ hội việc làm phù hợp dành cho bạn (${matchedJobs.length} việc làm)`,
            'jobNotificationAggregate', // Bạn có thể muốn một template mới cho email tổng hợp
            {
              userName: user.name || 'Ứng viên',
              emailContent: jobListHtml // Truyền nội dung HTML đã tạo
            }
          );

          console.log(`✅ Đã gửi mail tổng hợp đến user "${user.email}" với ${matchedJobs.length} job.`);

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