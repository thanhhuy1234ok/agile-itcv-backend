const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../configs/cloudinary');
const {sendError} = require('../utils/response')
const statusCodes = require('../constants/statusCodes')

// Storage PDF (Local)
const pdfStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const companyId = req.body.companyId || 'default';
    const dir = `uploads/company_${companyId}`;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const userId = req.user._id;
    const fileName = `${userId}_${file.originalname}`;
    cb(null, fileName);
  }
});

// Storage Ảnh (Cloudinary)
const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'images',
    format: async () => 'jpg',
    public_id: (req, file) => {
      const originalName = path.parse(file.originalname).name;
      return originalName;
    },
  },
});

// Middleware chọn storage theo x-file-type
const chooseUploader = (req, res, next) => {
  const fileType = req.headers['x-file-type'];

  if (fileType === 'pdf') {
    req.upload = multer({
      storage: pdfStorage,
      fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') cb(null, true);
        else cb(new Error('Chỉ cho phép file PDF'));
      },
      limits: { fileSize: 5 * 1024 * 1024 }
    }).single('file');
  } else if (fileType === 'image') {
    req.upload = multer({
      storage: imageStorage,
      fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) cb(null, true);
        else cb(new Error('Chỉ cho phép file ảnh'));
      },
      limits: { fileSize: 3 * 1024 * 1024 }
    }).single('file');
  } else {
    return sendError(res, statusCodes.BAD_REQUEST, 'Header x-file-type không hợp lệ. Chọn pdf hoặc image.');
  }

  next();
};

module.exports = { chooseUploader };
