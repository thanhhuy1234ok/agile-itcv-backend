const {
  createJobNotificationService,
  updateJobNotificationService,
} = require('../services/jobNotification.service');

const { sendSuccess, sendError } = require('../utils/response');
const StatusCodes = require('../constants/statusCodes');

const createJobNotification = async (req, res) => {
  try {
    const user = req.user;
    const { skills } = req.body;

    if (!skills || !Array.isArray(skills)) {
      return sendError(res, StatusCodes.BAD_REQUEST, 'Skills là một mảng bắt buộc');
    }

    const jobNotification = await createJobNotificationService({
      userId: user._id,
      skills,
    });

    return sendSuccess(res, 'Tạo JobNotification thành công', jobNotification, StatusCodes.CREATED);
  } catch (error) {
    console.error('❌ Lỗi tạo JobNotification:', error.message);
    return sendError(res, StatusCodes.BAD_REQUEST, error.message);
  }
};

const updateJobNotification = async (req, res) => {
  try {
    const user = req.user;
    const { skills } = req.body;

    if (!skills || !Array.isArray(skills)) {
      return sendError(res, StatusCodes.BAD_REQUEST, 'Skills phải là một mảng');
    }

    const jobNotification = await updateJobNotificationService(user._id, skills);

    return sendSuccess(res, 'Cập nhật JobNotification thành công', jobNotification, StatusCodes.OK);
  } catch (error) {
    console.error('❌ Lỗi cập nhật JobNotification:', error.message);
    return sendError(res, StatusCodes.BAD_REQUEST, error.message);
  }
};

module.exports = {
  createJobNotification,
  updateJobNotification,
};
