const cloudinary = require('cloudinary').v2;

require('dotenv').config();

if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_KEY || !process.env.CLOUDINARY_SECRET) {
  console.error('Cloudinary configuration error: Missing environment variables.');
  process.exit(1);
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

module.exports = cloudinary;
