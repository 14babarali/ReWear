// routes/gigs.js
const express = require('express');
const {
  createGig,
  getAllGigs,
  getGigById,
  updateGig,
  deleteGig,
  getUserGigs,
  addCollection, 
  getCollections
} = require('../controllers/gigController');

const collection = require('../controllers/collection');

const plan = require('../controllers/plan');

const { verifyToken } = require('../middleware/authMiddleware');
// const checkIfVerified = require('../middleware/verifyUser');
const router = express.Router();
const upload = require('../middleware/multer');

// Add New Gig
router.post('/add', verifyToken, upload.array('gigImage'), createGig); // Accept an array of media files

// Get Gigs of the Authenticated User
router.get('/myGig', verifyToken, getUserGigs);

router.post('/collections', addCollection);

// Optional: Route to fetch all collections
router.get('/collections', getCollections);
// Get all Gigs
router.get('/all', verifyToken, getAllGigs);

// Get a Gig by ID
router.get('/:id', verifyToken, getGigById);

// Update a Gig (only for verified users)
router.put('/:id', verifyToken, updateGig); // Accept an array of media files

// Delete a Gig (only for verified users)
router.delete('/:id', verifyToken, deleteGig);

// Collection routes
router.post('/gigs/collections/add/:id', upload.array('image') , addCollection);
router.put('/gigs/:gigId/collections/:collectionId', collection.updateCollection);
router.delete('/gigs/:gigId/collections/:collectionId', collection.deleteCollection);

// Plan routes
router.post('/gigs/:id/plans', plan.createPlan);
router.put('/gigs/:gigId/plans/:planId', plan.updatePlan);
router.delete('/gigs/:gigId/plans/:planId', plan.deletePlan);


module.exports = router;
