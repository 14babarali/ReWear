// routes/gigs.js
const express = require('express');
const { createGig , getAllGigs, getGigById, updateGig, deleteGig} = require('../controllers/gigController');
const { verifyToken } = require('../middleware/authMiddleware'); // Ensure user authentication
const checkIfVerified = require('../middleware/verifyUser'); 
const router = express.Router();


router.post('/', verifyToken, checkIfVerified, createGig);


// Get all Gigs
router.get('/', getAllGigs);

// Get a Gig by ID
router.get('/:id', getGigById);

// Update a Gig (only for verified users)
router.put('/:id', verifyToken, checkIfVerified, updateGig);

// Delete a Gig (only for verified users)
router.delete('/:id', verifyToken, checkIfVerified, deleteGig);

module.exports = router;