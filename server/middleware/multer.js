const multer = require('multer');
const path = require('path');

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../uploads/'); // Directory where files will be saved
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`); // Save file with original name and add a timestamp
  }
});

// File filter to accept only certain types (e.g., images)
const fileFilter = (req, file, cb) => {
  // Filter for allowed file types (images and videos)
const allowedMimeTypes = [
  'image/jpeg',
  'image/png',
  'image/jpg',
  'image/webp',
  'image/jfif',
  'video/mp4',
  'video/mkv',
  'video/x-msvideo', // AVI
  'video/quicktime', // MOV
  'video/x-flv',     // FLV
  'video/webm'       // WEBM
];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type, only JPEG and PNG is allowed!'), false);
  }
};

// Set multer storage and file filter
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: (req, file, cb) => {
      // Set file size limits based on the file type
      if (file.mimetype.startsWith('image/')) {
        cb(null, 1024 * 1024 * 10); // Limit file size to 10MB for images
      } else if (file.mimetype.startsWith('video/')) {
        cb(null, 1024 * 1024 * 100); // Limit file size to 100MB for videos
      } else {
        cb(new Error('Invalid file type!'), false); // Reject other types
      }
    }
  },
  fileFilter: fileFilter
});

module.exports = upload;
