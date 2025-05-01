const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'ddhjlaqjn', 
  secure: true,
  api_key: '442231988478843',
  api_secret: 'CdVq9FzMO5jDz_iLvtgRcf82DmA',
});

module.exports = cloudinary;
