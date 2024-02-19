const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: '313751292994883', // Reemplaza 'tu_cloud_name' con tu cloud_name
  api_key: '313751292994883',     // Reemplaza 'tu_api_key' con tu API Key
  api_secret: 'tu_api_secret'     // Reemplaza 'tu_api_secret' con tu API Secret
});

const multer = require('multer');
const upload = multer();

module.exports = upload;
