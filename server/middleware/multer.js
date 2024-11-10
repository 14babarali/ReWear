const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads'); // Adjust path as needed
    // Create the uploads directory if it doesn't exist
    cb(null, uploadPath); // Use the created or existing directory
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`); // Save file with original name and add a timestamp
  }
});

// File filter to accept only certain types and apply size limits based on file type
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/jpg',
    'image/webp',
    'image/jfif',
    'image/avif',
    'video/mp4',
    'video/mkv',
    'video/x-msvideo', // AVI
    'video/quicktime', // MOV
    'video/x-flv',     // FLV
    'video/webm'       // WEBM
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    // Check file size based on file type
    const fileSizeLimit = file.mimetype.startsWith('image/') ? 10 * 1024 * 1024 : 100 * 1024 * 1024; // 20MB for images, 100MB for videos
    
    if (file.size > fileSizeLimit) {
      cb(new Error(`File is too large. Maximum size allowed for ${file.mimetype.startsWith('image/') ? 'images' : 'videos'} is ${fileSizeLimit / (1024 * 1024)} MB.`), false);
    } else {
      cb(null, true); // Accept file
    }
  } else {
    cb(new Error('Invalid file type! Only specific images and videos are allowed.'), false);
  }
};

// Set multer storage and file filter
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 105 * 1024 * 1024 } // Set max possible limit; actual limit is managed in fileFilter
});

module.exports = upload;
