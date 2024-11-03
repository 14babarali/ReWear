const multer = require('multer');
const path = require('path');

// Multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../uploads/') // Directory where all images will be stored
    },
    filename: function (req, file, cb) {
        // Create unique file names with fieldname, timestamp, and original extension
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

// Initialize multer with storage, file size limit, and file filter
const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 }, // Limit file size to 5MB
    fileFilter: (req, file, cb) => {
        const allowedFileTypes =  /jpeg|jpg|png|gif|mp4|mkv|avi|mov/;; // Allow these file types
        const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedFileTypes.test(file.mimetype);
        
        if (extname && mimetype) {
            cb(null, true);
        } else {
            cb(new Error('Only images (jpeg, jpg, png, gif) are allowed.'));
        }
    }
});

module.exports = upload;
