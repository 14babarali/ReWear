const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware'); // Authenticate middleware
const upload = require('../middleware/multer');
const review = require('../controllers/reviews');

router.post('/add',authMiddleware.verifyToken,upload.array('images', 10), review.createReview);

router.get('/get/:id', review.getProductReviews);

router.get('/product/:id',authMiddleware.verifyToken, review.getUserProductReviews);

router.get('/getall',authMiddleware.verifyToken, review.getAllReviews);

module.exports = router;