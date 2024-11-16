const TailorRequest = require('../models/tailorRequest.js');  // Assuming your model is in the `models` directory

// Create a new tailor request
const createTailorRequest = async (req, res) => {
  try {
    // Destructure data from the request body
    const { buyerId, gigId, userCategory, fitType, description, measurements } = req.body;

    // Create a new tailor request instance
    const newRequest = new TailorRequest({
      buyerId,
      gigId,
      userCategory,
      fitType,
      description,
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
    console.error(err);
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
