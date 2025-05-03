const { sendSuccess, sendError } = require('../utils/response');
const statusCodes = require('../constants/statusCodes')

const uploadFile = (req, res) => {
    req.upload(req, res, function (err) {
      if (err) {
        console.error('Upload error:', err);
        return sendError(res, statusCodes.INTERNAL_SERVER_ERROR, 'Lỗi upload');
      }
  
      if (!req.file) {
        return sendError(res, statusCodes.BAD_REQUEST, 'Không tìm thấy file đã upload');
      }
  
      if (req.headers['x-file-type'] === 'image') {
        return sendSuccess(res, 'Tải ảnh thành công', {imageUrl: req.file.path, public_id: req.file.filename}, statusCodes.OK);
      }
  
      return sendSuccess(res, 'Tải file PDF thành công', {fileName: req.file.filename,filePath: req.file.path}, statusCodes.OK);
    });
  };
  
  module.exports = { uploadFile };
  