const express = require('express');
const router = express.Router();
const tailorRequestController = require('../controllers/tailorRequestController');

router.post('/tailor-request', tailorRequestController.createTailorRequest);

router.get('/tailor-request/:id', tailorRequestController.getTailorRequest);

module.exports = router;
