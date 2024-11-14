const fs = require('fs');
const path = require('path');
const MeasurementRequest = require('../models/tailor_requests');

// Create a new measurement request
exports.createMeasurementRequest = async (req, res) => {
  try {
    const { buyerId, gigId, userCategory, fitType, description, measurements } = req.body;

    // Check if each required field is present, and return specific error messages
    if (!buyerId) {
      return res.status(400).json({ message: 'Buyer ID is required.' });
    }
    if (!gigId) {
      return res.status(400).json({ message: 'Gig ID is required.' });
    }
    if (!userCategory) {
      return res.status(400).json({ message: 'User category is required.' });
    }
    if (!fitType) {
      return res.status(400).json({ message: 'Fit type is required.' });
    }
    if (!description) {
      return res.status(400).json({ message: 'Description is required.' });
    }
    if (!measurements) {
      return res.status(400).json({ message: 'Measurements data is required.' });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'Picture is required.' });
    }

    // Parse the measurements JSON string
    const parsedMeasurements = JSON.parse(measurements);
    console.log("Parsed Measurements:", JSON.stringify(parsedMeasurements, null, 2));

    // Construct the new measurement request with the provided data
    const newRequest = new MeasurementRequest({
      buyerId,
      gigId,
      userCategory,
      fitType,
      description,
      measurements: parsedMeasurements, // this will include type in both shirt and trouser, if present
      picture: req.file.filename, // Store only the filename of the uploaded picture
    });

    await newRequest.save();
    res.status(201).json(newRequest);
  } catch (error) {
    console.error("Error creating measurement request:", error);

    // Delete uploaded picture on error
    if (req.file) {
      const imagePath = path.join(__dirname, '..', 'uploads', req.file.filename);
      fs.unlink(imagePath, (err) => {
        if (err) console.error("Error deleting file:", err);
        else console.log("Image deleted:", req.file.filename);
      });
    }

    res.status(500).json({ error: 'An error occurred while creating the measurement request.' });
  }
};

// Update a measurement request
exports.updateMeasurementRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Find the existing request to get the current picture path
    const existingRequest = await MeasurementRequest.findById(id);
    if (!existingRequest) {
      if (req.file) {
        const imagePath = path.join(__dirname, '..', 'uploads', req.file.filename);
        fs.unlink(imagePath, (err) => {
          if (err) console.error("Error deleting file:", err);
          else console.log("Image deleted:", req.file.filename);
        });
      }
      return res.status(404).json({ error: 'Measurement request not found.' });
    }

    // Handle image update
    if (req.file) {
      console.log('New image uploaded:', req.file.filename);

      // Delete old image if it exists
      if (existingRequest.picture) {
        const oldImagePath = path.join(__dirname, '..', 'uploads', existingRequest.picture);
        fs.unlink(oldImagePath, (err) => {
          if (err) console.error('Error deleting old image:', err);
          else console.log('Old image deleted:', existingRequest.picture);
        });
      }

      updates.picture = req.file.filename;
    }

    const updatedRequest = await MeasurementRequest.findByIdAndUpdate(id, updates, { new: true });
    res.status(200).json(updatedRequest);
  } catch (error) {
    console.error("Error updating measurement request:", error);

    // Delete new uploaded picture if update fails
    if (req.file) {
      const imagePath = path.join(__dirname, '..', 'uploads', req.file.filename);
      fs.unlink(imagePath, (err) => {
        if (err) console.error("Error deleting file:", err);
        else console.log("Image deleted:", req.file.filename);
      });
    }

    res.status(500).json({ error: 'An error occurred while updating the measurement request.' });
  }
};

// Get a measurement request by ID
exports.getMeasurementRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await MeasurementRequest.findById(id).populate('buyerId');
    if (!request) {
      return res.status(404).json({ error: 'Measurement request not found.' });
    }
    res.status(200).json(request);
  } catch (error) {
    console.error("Error fetching measurement request:", error);
    res.status(500).json({ error: 'An error occurred while fetching the measurement request.' });
  }
};

// Get all measurement requests for a specific buyer
exports.getMeasurementRequestsByBuyer = async (req, res) => {
  try {
    const { buyerId } = req.params;
    const requests = await MeasurementRequest.find({ buyerId });
    res.status(200).json(requests);
  } catch (error) {
    console.error("Error fetching measurement requests for buyer:", error);
    res.status(500).json({ error: 'An error occurred while fetching measurement requests.' });
  }
};

// Delete a measurement request
exports.deleteMeasurementRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRequest = await MeasurementRequest.findByIdAndDelete(id);
    if (!deletedRequest) {
      return res.status(404).json({ error: 'Measurement request not found.' });
    }
    res.status(200).json({ message: 'Measurement request deleted successfully.' });
  } catch (error) {
    console.error("Error deleting measurement request:", error);
    res.status(500).json({ error: 'An error occurred while deleting the measurement request.' });
  }
};
