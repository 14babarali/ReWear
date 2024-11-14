const express = require('express');
const router = express.Router();
const upload = require('../middleware/multer');
const auth = require('../middleware/authMiddleware');
const MeasurementRequestController = require('../controllers/MeasurementRequestController');

// Multer configuration for handling file uploads
 

// Route to create a new measurement request
router.post('/create',auth .verifyToken, upload.single('picture'), MeasurementRequestController.createMeasurementRequest);

// Route to get a measurement request by ID
router.get('/:id',auth.verifyToken, MeasurementRequestController.getMeasurementRequestById);

// Route to get all measurement requests for a specific buyer
router.get('/buyer/:buyerId',auth.verifyToken, MeasurementRequestController.getMeasurementRequestsByBuyer);

// Route to update a measurement request by ID
router.put('/:id',auth.verifyToken, upload.single('picture'), MeasurementRequestController.updateMeasurementRequest);

// Route to delete a measurement request by ID
router.delete('/:id',auth.verifyToken, MeasurementRequestController.deleteMeasurementRequest);

module.exports = router;
                 