// controllers/gigController.js
const Gig = require('../models/Gig');
const User = require('../models/User'); 

// Create a Gig (only for verified Tailor users with uploaded CNIC)
const createGig = async (req, res) => {
  const {
    title,
    description,
    serviceType,
    fabricType,
    measurementsRequired,
    measurementInstructions,
    basicPrice,
    premiumPrice,
    basicDeliveryDays,
    premiumDeliveryDays
  } = req.body;

  let gigPic = req.file ? req.file.filename : ''; // Handle image upload if applicable

  const userId = req.user.id; // Use the authenticated user's ID

  try {
    // Find the user
    const user = await User.findById(userId);

    // Ensure the user is a verified Tailor with uploaded CNIC
    if (user.role !== 'Tailor') {
      return res.status(403).json({ error: 'Only Tailor users can create gigs' });
    }

    if (!user.isVerified || !user.profile.cnicfront || !user.profile.cnicback) {
      return res.status(403).json({ error: 'You must be a verified user with uploaded CNIC to create a gig' });
    }

    // Create the new gig
    const newGig = new Gig({
      user: userId,
      title, // New field for gig title
      gigImage: gigPic,
      description,
      serviceType,
      fabricType,
      measurementsRequired,
      measurementInstructions,
      basicPrice,
      premiumPrice,
      basicDeliveryDays,
      premiumDeliveryDays,
    });

    // Save the gig
    await newGig.save();

    res.status(201).json(newGig);
  } catch (error) {
    console.error('Error creating gig:', error);
    res.status(500).json({ error: 'Error creating gig' });
  }
};

 

// Get Gigs of the Authenticated User
const getUserGigs = async (req, res) => {

  const userId = req.user.id; 


  try {
    // Find gigs that belong to the authenticated user
    const userGigs = await Gig.find({ user: userId }).populate('user', 'name');

    res.status(200).json(userGigs);
  } catch (error) {
    console.error('Error fetching user gigs:', error);
    res.status(500).json({ error: 'Error fetching user gigs' });
  }
};


// Get all Gigs
const getAllGigs = async (req, res) => {
    try {
      const gigs = await Gig.find().populate('user', 'name'); // Populate the user's name
      res.status(200).json(gigs);
    } catch (error) {
      console.error('Error fetching gigs:', error);
      res.status(500).json({ error: 'Error fetching gigs' });
    }
  };
  
  // Get a Gig by ID
  const getGigById = async (req, res) => {
    const { id } = req.params;
  
    try {
      const gig = await Gig.findById(id).populate('user', 'name');
      if (!gig) {
        return res.status(404).json({ error: 'Gig not found' });
      }
      res.status(200).json(gig);
    } catch (error) {
      console.error('Error fetching gig:', error);
      res.status(500).json({ error: 'Error fetching gig' });
    }
  };
  
  // Update a Gig (only for verified users)
  const updateGig = async (req, res) => {
    const { id } = req.params;
    const { gigImage, description, skills, basicPrice, premiumPrice } = req.body;
    const userId = req.user.id; // Authenticated user's ID
  
    try {
      const gig = await Gig.findById(id);
  
      // Ensure the gig exists
      if (!gig) {
        return res.status(404).json({ error: 'Gig not found' });
      }
  
      // Check if the authenticated user is the owner of the gig
      if (gig.user.toString() !== userId) {
        return res.status(403).json({ error: 'You can only update your own gigs' });
      }
  
      // Update gig details
      gig.gigImage = gigImage || gig.gigImage;
      gig.description = description || gig.description;
      gig.skills = skills || gig.skills;
      gig.basicPrice = basicPrice || gig.basicPrice;
      gig.premiumPrice = premiumPrice || gig.premiumPrice;
  
      // Save updated gig
      await gig.save();
  
      res.status(200).json(gig);
    } catch (error) {
      console.error('Error updating gig:', error);
      res.status(500).json({ error: 'Error updating gig' });
    }
  };
  
  // Delete a Gig (only for verified users)
  const deleteGig = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id; // Authenticated user's ID
  
    try {
      const gig = await Gig.findById(id);
  
      // Ensure the gig exists
      if (!gig) {
        return res.status(404).json({ error: 'Gig not found' });
      }
  
      // Check if the authenticated user is the owner of the gig
      if (gig.user.toString() !== userId) {
        return res.status(403).json({ error: 'You can only delete your own gigs' });
      }
  
      // Delete the gig
      await gig.remove();
  
      res.status(200).json({ message: 'Gig deleted successfully' });
    } catch (error) {
      console.error('Error deleting gig:', error);
      res.status(500).json({ error: 'Error deleting gig' });
    }
  };
  


  module.exports = {
    createGig,
    getAllGigs,
    getGigById,
    updateGig,
    deleteGig,
    getUserGigs, 
  };