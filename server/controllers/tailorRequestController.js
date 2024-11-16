const fs = require('fs');
const path = require('path');
const TailorRequest = require('../models/TailorRequest'); // Adjust the path to your TailorRequest model

const createTailorRequest = async (req, res) => {
  const { buyerId, gigId, userCategory, fitType, description } = req.body;
  const measurements = JSON.parse(req.body.measurements); // Parse the JSON string
  const picture = req.file?.fileName || null;
  console.log(req.body);
  try {
    // Validate required fields
    if (!buyerId || !gigId || !userCategory || !fitType || !description || !measurements) {
      return res.status(400).json({ message: 'All required fields must be provided.' });
    }

    // Create a new tailor request
    const newRequest = new TailorRequest({
      buyerId,
      gigId,
      userCategory,
      fitType,
      description,
      picture,
      measurements,
    });

    // Save the request to the database
    await newRequest.save();

    // Return a success response with the saved data
    res.status(201).json({
      message: 'Tailor request created successfully!',
      data: newRequest,
    });
  } catch (err) {
    console.error('Error creating tailor request:', err);

    // Delete the uploaded picture if the request fails
    if (picture) {
      const filePath = path.join(__dirname, '../uploads', picture); // Adjust the path based on your file storage
      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr) {
          console.error('Failed to delete picture:', unlinkErr);
        } else {
          console.log('Picture deleted successfully.');
        }
      });
    }

    res.status(500).json({
      message: 'An error occurred while creating the tailor request.',
      error: err.message,
    });
  }
};

// Fetch a tailor request by ID
const getTailorRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const tailorRequest = await TailorRequest.findById(id).populate('buyerId').populate('gigId');

    if (!tailorRequest) {
      return res.status(404).json({ message: 'Tailor request not found' });
    }

    res.status(200).json({
      message: 'Tailor request retrieved successfully',
      data: tailorRequest,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'An error occurred while fetching the tailor request.',
      error: err.message,
    });
  }
};

module.exports = {
  createTailorRequest,
  getTailorRequest,
};
