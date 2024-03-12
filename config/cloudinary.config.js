const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

// Configurar Cloudinary utilizando las variables de entorno
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const multer = require('multer');
const upload = multer();

module.exports = upload;
