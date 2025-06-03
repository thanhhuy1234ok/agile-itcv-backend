const { sendError, sendSuccess } = require('../utils/response');
const statusCodes = require('../constants/statusCodes');

const uploadFile = (req, res) => {
  req.upload(req, res, function (err) {
    if (err) {
      return sendError(res, statusCodes.BAD_REQUEST, err.message || 'Tải file thất bại');
    }

    const file = req.file;
    if (!file || !file.path) {
      return sendError(res, statusCodes.BAD_REQUEST, 'Không có file nào được tải lên');
    }

    return sendSuccess(res, 'Tải file thành công',
      {
        url: file.path,            
        originalName: file.originalname,
      }, statusCodes.OK
    );
  });
};

module.exports = { uploadFile };

  