const Gig = require("../models/Gig");
const User = require("../models/User");
const fs = require('fs');
const path = require('path');

// Create a Gig (only for verified Tailor users with uploaded CNIC)
const createGig = async (req, res) => {

  const { title, description, experience } = req.body;

  const userId = req.user.id; // Use the authenticated user's ID

  // console.log(services);
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
    // const parsedServices = typeof services === 'string' ? JSON.parse(services) : services;

    // const serviceList = Array.isArray(services) ? services : [];
    // if(!serviceList){
    //   res.status(400).json({message: 'Services are not of Array Type'});
    // }

    // Create the new gig
    const newGig = new Gig({
      user: userId,
      title,
      description,
      experience,
      // services: serviceList,
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

const getAllGigs = async (req, res) => {
  try {
    // Populate all fields in the user document for each gig
    const gigs = await Gig.find().populate({
      path: "user",
      select: "-password -__v", // Exclude sensitive fields like password and internal fields
    });

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
  const { title, experience, description } = req.body;

  try {

    // Find the gig
    const gig = await Gig.findById(id);
    if (!gig) return res.status(404).json({ message: 'Gig not found' });

    // Verify the user is the owner of the gig
    if (gig.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to update this gig' });
    }

    // Update fields
    gig.title = title ? title : gig.title;
    gig.experience = experience ? experience : gig.experience;
    gig.description = description ? description : gig.description;

    // Handle gig image update if a new image is uploaded
    if (req.file) {
      // Delete the old image if it exists
      if (gig.gigImage) {
        const oldImagePath = path.join(__dirname, '..', 'uploads', gig.gigImage);
        fs.unlink(oldImagePath, (err) => {
          if (err) console.error('Error deleting old image:', err);
        });
      }

      // Save the new image filename
      gig.gigImage = req.file.filename;
    }

    // Save the updated gig
    await gig.save();
    res.status(200).json({ message: 'Gig updated successfully', gig });
  } catch (error) {
    console.error('Error updating gig:', error);
    res.status(500).json({ message: 'Server error while updating gig' });
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

// Adding new Collections into the Existing Gig
const addCollection = async (req, res) => {
  const { title } = req.body;
  const gigId = req.params.id;
  const imagePaths = req.files ? req.files.map(file => file.filename) : [];

  // Check for required fields
  if (!imagePaths || imagePaths.length === 0) {
    return res.status(400).json({ error: "At least one image is required." });
  } else if (!title) {
    return res.status(400).json({ error: "Title is required." });
  } else if (!gigId) {
    return res.status(400).json({ error: "Gig ID is required." });
  }

  try {
    // Check if the gig exists
    const gig = await Gig.findById(gigId);
    if (!gig) {
      // Delete uploaded images if the gig does not exist
      imagePaths.forEach(filename => {
        const imagePath = path.join(__dirname, '..', 'uploads', filename);
        try {
          fs.unlinkSync(imagePath);
        } catch (err) {
          console.error("Error deleting image file:", err);
        }
      });
      return res.status(404).json({ error: "Gig not found." });
    }

    // Create a new collection
    const newCollection = {
      title,
      image: imagePaths,
      items: [], // Default to an empty array if items are not provided
    };

    // Add the new collection to the gig
    gig.collections.push(newCollection);
    const updatedGig = await gig.save();

    res.status(201).json(updatedGig); // Return the updated gig
  } catch (error) {
    console.error("Error adding collection:", error);

    // Delete uploaded images if there's an error during the process
    imagePaths.forEach(filename => {
      const imagePath = path.join(__dirname, '..', 'uploads', filename);
      try {
        fs.unlinkSync(imagePath);
      } catch (err) {
        console.error("Error deleting image file:", err);
      }
    });

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

const deleteCollection = async (req, res) => {
  const { gigId, collectionId } = req.params;

  // Check for required IDs
  if (!gigId || !collectionId) {
    return res.status(400).json({ error: "Gig ID and Collection ID are required." });
  }

  try {
    // Find the gig and check if it exists
    const gig = await Gig.findById(gigId);
    if (!gig) {
      return res.status(404).json({ error: "Gig not found." });
    }

    // Find the collection index within the gig's collections array
    const collectionIndex = gig.collections.findIndex(collection => collection._id.toString() === collectionId);
    if (collectionIndex === -1) {
      return res.status(404).json({ error: "Collection not found." });
    }



    // Remove associated images from storage
    gig.collections[collectionIndex].image.forEach(imageFilename => {
      const imagePath = path.join(__dirname, '..', 'uploads', imageFilename); // Build full path to the image
      console.log(imageFilename);
      try {
        fs.unlinkSync(imagePath); // Delete image file
      } catch (err) {
        console.error("Error deleting image file:", err);
      }
    });

    // Remove the collection from the array
    gig.collections.splice(collectionIndex, 1);

    // Save the updated gig document
    await gig.save();

    res.status(200).json({ message: "Collection deleted successfully.", gig });
  } catch (error) {
    console.error("Error deleting collection:", error);
    res.status(500).json({ error: "Failed to delete collection." });
  }
};

const addServiceToGig = async (req, res) => {
  const gigId = req.params.id;
  const { name, plans } = req.body;  // Now expect both name and plans in the request body

  if (!name) {
    return res.status(400).json({ message: "Service name is required." });
  }

  try {
    const gig = await Gig.findById(gigId);

    if (!gig) {
      return res.status(404).json({ message: 'Gig not found' });
    }

    // Check if the service already exists
    if (gig.services.some((service) => service.name === name)) {
      return res.status(400).json({ message: 'Service already exists in the gig.' });
    }

    // Add the new service with plans to the services array
    gig.services.push({ name, plans });
    await gig.save();

    return res.status(200).json(gig);
  } catch (error) {
    console.error("Error adding service:", error);
    return res.status(500).json({ message: 'Error adding service', error: error.message });
  }
};

const deleteServiceFromGig = async (req, res) => {
  const gigId = req.params.id; // Get gigId from the request parameters
  const { Id } = req.body;    // Get service name from request body

  // Ensure the service name is provided
  if (!Id) {
    return res.status(400).json({ message: "Service Id is required." });
  }

  try {
    // Find the gig by ID and remove the specified service from the services array
    const gig = await Gig.findByIdAndUpdate(
      gigId,
      { $pull: { services: { _id: Id } } }, // Correct $pull syntax
      { new: true } // Return the updated document
    );

    // Check if the gig was found
    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    return res.status(200).json(gig); // Respond with the updated gig
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error deleting service", error: error.message });
  }
};

const addItemToCollection = async (req, res) => {
  console.log('Body : ',req.body);
  const { gigId, collectionId } = req.params;
  const { comment } = req.body; // Expect 'type' and 'comment' from frontend
  let imagePaths;
  if(req.file?.filename){
    imagePaths = req.file?.filename
  }

  try {

    // Find gig and validate collection
    const gig = await Gig.findById(gigId);
    if (!gig) return res.status(404).json({ message: 'Gig not found' });

    const collection = gig.collections.id(collectionId);
    if (!collection) return res.status(404).json({ message: 'Collection not found' });
    console.log(gig);
    console.log(collection);

    // Construct URL for the saved file
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${imagePaths}`;

    // Add the new media item to the collection
    collection.items.push({
      comment,
      url: fileUrl,
    });

    await gig.save();

    res.status(200).json({
      message: 'Item added to collection successfully',
      collection
    });
  } catch (error) {
    console.error('Error adding item:', error);
    res.status(500).json({ message: 'Failed to add item to collection', error: error.message });
  }
};

const deleteItemFromCollection = async (req, res) => {
  const { gigId, collectionId, itemId } = req.params;

  try {
    // Step 1: Find the gig by ID
    const gig = await Gig.findById(gigId);
    if (!gig) {
      return res.status(404).json({ message: 'Gig not found.' });
    }

    // Step 2: Check if the user is the owner of the gig
    if (gig.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You do not have permission to delete items from this gig.' });
    }

    // Step 3: Locate the collection within the gig
    const collection = gig.collections.id(collectionId);
    if (!collection) {
      return res.status(404).json({ message: 'Collection not found.' });
    }

    // Step 4: Find the item within the collection by index
    const itemIndex = collection.items.findIndex(item => item._id.toString() === itemId);
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found.' });
    }

    const item = collection.items[itemIndex];

    // Step 5: Delete each file associated with the item
    item.url.forEach((fileUrl) => {
      const filename = path.basename(fileUrl);
      const filePath = path.join(__dirname, '..', 'uploads', filename);

      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("Error deleting file:", err);
        }
      });
    });

    // Step 6: Remove the item from the collection by index
    collection.items.splice(itemIndex, 1);

    await gig.save();
    res.status(200).json({ message: 'Item and associated files deleted successfully.' });
  } catch (error) {
    console.error('Error in deleteItemFromCollection:', error);
    res.status(500).json({ message: 'An error occurred while deleting the item.' });
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
  deleteCollection,
  addServiceToGig,
  deleteServiceFromGig,
  addItemToCollection,
  deleteItemFromCollection
};
