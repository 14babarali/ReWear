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
  getCollections,
  deleteCollection,
  addServiceToGig,
  deleteServiceFromGig,
  addItemToCollection,
  deleteItemFromCollection
} = require('../controllers/gigController');
const collection = require('../controllers/collection');
const plan = require('../controllers/plan');
const { verifyToken } = require('../middleware/authMiddleware');
const router = express.Router();
const upload = require('../middleware/multer');
const { verify } = require('jsonwebtoken');

// Add New Gig
router.post('/add', verifyToken, upload.array('gigImage'), createGig); // Accept an array of media files

// Get Gigs of the Authenticated User
router.get('/myGig', verifyToken, getUserGigs);


// Optional: Route to fetch all collections
router.get('/collections', getCollections);

router.delete('/remove/:id',deleteCollection);

// Get all Gigs
router.get('/all', verifyToken, getAllGigs);

router.get('/allTailor', getAllGigs);

// Get a Gig by ID
router.get('/:id', verifyToken, getGigById);

// Update a Gig (only for verified users)
// router.put('/update/:id', verifyToken, updateGig);
router.put('/update/:id', verifyToken, upload.single('gigImage'), async (req, res, next) => {
  try {
    console.log('Received PUT request to update gig:', req.params.id);
    await updateGig(req, res); // Call the update function from the controller
  } catch (error) {
    console.error('Error in /gigs/update/:id route:', error.message);
    res.status(500).json({ message: 'Error updating gig', error: error.message });
  }
});

// Delete a Gig (only for verified users)
router.delete('/:id', verifyToken, deleteGig);

/////Servicess
router.post('/services/:id', addServiceToGig);
router.delete('/services/delete/:id',deleteServiceFromGig);


// Collection routes
router.post('/collections/add/:id',verifyToken, upload.array('image') , addCollection);
// router.put('/gigs/:gigId/collections/:collectionId', updateCollection);
router.delete('/:gigId/collections/:collectionId',verifyToken, deleteCollection);

// Collection Items route
router.post('/:gigId/collections/:collectionId/items', verifyToken, upload.single('file') , addItemToCollection);
router.delete('/:gigId/collections/:collectionId/items/:itemId',verifyToken, deleteItemFromCollection);


// Plan routes
router.post('/gigs/:id/plans', plan.createPlan);
router.put('/gigs/:gigId/plans/:planId', plan.updatePlan);
router.delete('/gigs/:gigId/plans/:planId', plan.deletePlan);


module.exports = router;
