// middleware/verifyUser.js
const User = require('../models/User');

const checkIfVerified = async (req, res, next) => {
  try {
    const userId = req.user.id; 

  
    const user = await User.findById(userId);

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the user is verified
    if (!user.isVerified || !user.profile.cnicfront || !user.profile.cnicback) {
      return res.status(403).json({ message: 'User is not verified or CNIC is missing' });
    }

    // User is verified, proceed to the next middleware
    next();
  } catch (error) {
    console.error('Verification check error:', error);
    res.status(500).json({ message: 'An error occurred during user verification' });
  }
};

module.exports = checkIfVerified;
