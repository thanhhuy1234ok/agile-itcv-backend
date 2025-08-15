const User = require("../schema/user.schema");
const { sendError, sendSuccess } = require("../utils/response");
const statusCodes = require("../constants/statusCodes");

const uploadFile = (req, res) => {
  req.upload(req, res, async function (err) {
    if (err) {
      return sendError(
        res,
        statusCodes.BAD_REQUEST,
        err.message || "Tải file thất bại"
      );
    }

    const file = req.file;
    if (!file || !file.path) {
      return sendError(
        res,
        statusCodes.BAD_REQUEST,
        "Không có file nào được tải lên"
      );
    }

    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        { cv_url: file.path },
        { new: true }
      );

      const userToSend = updatedUser.toObject();
      delete userToSend.password;

      return sendSuccess(
        res,
        "Tải file thành công và cập nhật CV",
        {
          url: file.path,
          originalName: file.originalname,
          user: userToSend,
        },
        statusCodes.OK
      );
    } catch (error) {
      console.error("Lỗi cập nhật user sau upload:", error);
      return sendError(
        res,
        statusCodes.INTERNAL_SERVER_ERROR,
        "Lỗi cập nhật user"
      );
    }
  });
};

module.exports = { uploadFile };
