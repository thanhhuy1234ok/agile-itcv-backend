const multer = require('multer');
const path = require('path');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../configs/cloudinary');
const { sendError } = require('../utils/response');
const statusCodes = require('../constants/statusCodes');

const cloudinaryStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const fileType = req.headers['x-file-type'];
    const originalName = path.parse(file.originalname).name;
    const userId = req.user?._id;

    if (!userId) {
      throw new Error('Thiếu userId trong token xác thực');
    }

    let folder = '';
    let public_id = '';

    if (fileType === 'pdf') {
      const companyId = req.body.companyId;
      if (!companyId) {
        throw new Error('Thiếu companyId trong form-data');
      }
      folder = `pdfs/company_${companyId}`;
      public_id = `${userId}_${originalName}`;
    } else if (fileType === 'image') {
      folder = 'images';
      public_id = originalName;
    } else {
      throw new Error('Header x-file-type không hợp lệ.');
    }

    return {
      folder,
      public_id,
      resource_type: fileType === 'pdf' ? 'raw' : 'image',
      format: fileType === 'pdf' ? 'pdf' : 'jpg',
    };
  },
});

const chooseUploader = (req, res, next) => {
  const fileType = req.headers['x-file-type'];

  if (!['pdf', 'image'].includes(fileType)) {
    return sendError(res, statusCodes.BAD_REQUEST, 'Header x-file-type không hợp lệ. Chọn pdf hoặc image.');
  }

  const fileFilter = (req, file, cb) => {
    if (fileType === 'pdf' && file.mimetype === 'application/pdf') return cb(null, true);
    if (fileType === 'image' && file.mimetype.startsWith('image/')) return cb(null, true);
    return cb(new Error(`Chỉ cho phép file ${fileType === 'pdf' ? 'PDF' : 'ảnh'}`));
  };

  req.upload = multer({
    storage: cloudinaryStorage,
    fileFilter,
    limits: { fileSize: fileType === 'pdf' ? 5 * 1024 * 1024 : 3 * 1024 * 1024 },
  }).single('file');

  next();
};


module.exports = { chooseUploader };
