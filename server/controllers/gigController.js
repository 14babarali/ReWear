const Gig = require("../models/Gig");
const User = require("../models/User");
const path = require("path");

// Create a Gig (only for verified Tailor users with uploaded CNIC)

const createGig = async (req, res) => {

  const { title, description, services, experience } = req.body;

  const userId = req.user.id; // Use the authenticated user's ID

  console.log(services);
  // Get the gig image from the uploaded file
  try {

    const existingGig = await Gig.findOne({ user: userId });
    
    if (existingGig) {
      // If a gig exists, prompt the user to update instead of creating a new gig
      return res.status(400).json({ message: "Gig already exists. Please update Gig instead." });
    }

    // Find the user
    const user = await User.findById(userId);

    // Check if user exists
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Ensure the user is a verified Tailor with uploaded CNIC
    if (user.role !== "Tailor") {
      return res
        .status(403)
        .json({ error: "Only Tailor users can create gigs" });
    }

    if (!user.isVerified || !user.profile.cnicfront || !user.profile.cnicback) {
      return res
        .status(403)
        .json({
          error:
            "You must be a verified user with uploaded CNIC to create a gig",
        });
    }

    const imagePaths = req.files ? req.files.map((file) => file.filename) : [];
    // const serviceList = Array.isArray(services) ? services : [];

    // Create the new gig
    const newGig = new Gig({
      user: userId,
      title,
      description,
      experience,
      services,
      gigImage: imagePaths[0], // Use the first image as the main gig image
    });

    // Save the gig
    await newGig.save();

    res.status(201).json(newGig);
  } catch (error) {
    console.error("Error creating gig:", error);
    res.status(500).json({ error: "Error creating gig" });
  }
};
// Get Gigs of the Authenticated User
const getUserGigs = async (req, res) => {


  try {
    // Find gigs that belong to the authenticated user
    const userGigs = await Gig.find()
      .populate()
      .exec();

    res.status(200).json(userGigs);
  } catch (error) {
    console.error("Error fetching user gigs:", error);
    res.status(500).json({ error: "Error fetching user gigs" });
  }
};

// Get all Gigs
const getAllGigs = async (req, res) => {
  try {
    const gigs = await Gig.find().populate("user", "name"); // Populate the user's name
    res.status(200).json(gigs);
  } catch (error) {
    console.error("Error fetching gigs:", error);
    res.status(500).json({ error: "Error fetching gigs" });
  }
};

// Get a Gig by ID
const getGigById = async (req, res) => {
  const { id } = req.params;

  try {
    const gig = await Gig.findById(id).populate("user", "name").exec();

    if (!gig) {
      return res.status(404).json({ error: "Gig not found" });
    }
    res.status(200).json(gig);
  } catch (error) {
    console.error("Error fetching gig:", error);
    res.status(500).json({ error: "Error fetching gig" });
  }
};

// Update a Gig (only for verified users)
const updateGig = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    collections, // Array of collections
    plans, // Array of pricing plans
  } = req.body;

  const userId = req.user.id; // Authenticated user's ID

  try {
    const gig = await Gig.findById(id);

    // Ensure the gig exists
    if (!gig) {
      return res.status(404).json({ error: "Gig not found" });
    }

    // Check if the authenticated user is the owner of the gig
    if (gig.user.toString() !== userId) {
      return res
        .status(403)
        .json({ error: "You can only update your own gigs" });
    }

    // Update gig details
    gig.title = title || gig.title;
    gig.description = description || gig.description;
    gig.gigImage = req.file
      ? path.join("uploads", req.file.filename)
      : gig.gigImage; // Update main gig image if new file uploaded
    gig.collections = collections ? JSON.parse(collections) : gig.collections; // Update collections if provided
    gig.plans = plans ? JSON.parse(plans) : gig.plans; // Update pricing plans if provided

    // Save updated gig
    await gig.save();

    res.status(200).json(gig);
  } catch (error) {
    console.error("Error updating gig:", error);
    res.status(500).json({ error: "Error updating gig" });
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
      return res.status(404).json({ error: "Gig not found" });
    }

    // Check if the authenticated user is the owner of the gig
    if (gig.user.toString() !== userId) {
      return res
        .status(403)
        .json({ error: "You can only delete your own gigs" });
    }

    // Delete the gig
    await gig.remove();

    res.status(200).json({ message: "Gig deleted successfully" });
  } catch (error) {
    console.error("Error deleting gig:", error);
    res.status(500).json({ error: "Error deleting gig" });
  }
};



// Controller to get a single gig by ID and include user details

// Controller for adding a new collection to a specific gig
const addCollection = async (req, res) => {
 
  // Get the gig ID from the URL
  const { gigId =req.params.id, title, image, items } = req.body; // Accept gigId as a part of the request

  if (!gigId || !title || !image) {
    return res.status(400).json({ error: "Gig ID, title, and image are required." });
  }

  try {
    // Create a new collection object
    const newCollection = {
      title,
      image,
      items: items || [], // Default to an empty array if items are not provided
    };
 
    console.log(newCollection); 
    // Find the gig by ID and push the new collection into its collections array
    const updatedGig = await Gig.findByIdAndUpdate(
      gigId,
      { $push: { collections: newCollection } },
      { new: true } // Return the updated document
    );

    if (!updatedGig) {
      return res.status(404).json({ error: "Gig not found." });
    }

    res.status(201).json(updatedGig); // Return the updated gig with the new collection
  } catch (error) {
    console.error("Error adding collection:", error);
    res.status(500).json({ error: "Failed to add collection." });
  }
};

// Optional: Controller for fetching all collections (if needed)
const getCollections = async (req, res) => {
  try {
    const collections = await Collection.find(); // Assuming you want to fetch all collections
    res.status(200).json(collections);
  } catch (error) {
    console.error("Error fetching collections:", error);
    res.status(500).json({ error: "Failed to fetch collections." });
  }
};


const addServiceToGig = async (req, res) => {
  const { gigId } = req.params; // Get gigId from the request parameters
  const { name } = req.body; // Get service name from request body

  try {
    // Find the gig by ID and update the services array
    const gig = await Gig.findByIdAndUpdate(
      gigId,
      { $push: { services: { name } } }, // Push new service to services array
      { new: true, useFindAndModify: false } // Return the updated document
    );

    // Check if the gig was found
    if (!gig) {
      return res.status(404).json({ message: 'Gig not found' });
    }

    return res.status(200).json(gig); // Respond with the updated gig
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error adding service', error: error.message });
  }
};

module.exports = {
  createGig,
  getAllGigs,
  getGigById,
  updateGig,
  deleteGig,
  getUserGigs,
  addCollection,
   getCollections,
   addServiceToGig,

};
