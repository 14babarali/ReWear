const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/multer');
const tailorRequestController = require('../controllers/tailorRequestController');

router.post('/tailor-request',authMiddleware.verifyToken , upload.single("picture"), tailorRequestController.createTailorRequest);

router.get('/tailor-request/:id', tailorRequestController.getTailorRequest);

module.exports = router;
