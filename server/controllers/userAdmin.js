const User = require('../models/User');
const Order = require('../models/Order');

// Controller to fetch all users except 'Admin'
exports.getAllNonAdminUsers = async (req, res) => {
    const user = req.user.id;
    try {
        // Check if the user exists in the request (for example, from authentication middleware)
        if (user) {
          // Find all users whose role is not 'Admin'
          const users = await User.find({ role: { $ne: 'Admin' } });
          
          // Check if any users were found
          if (users.length > 0) {
            // Return the list of users
            res.status(200).json(users);
            // console.log(user, users);
          } else {
            // No users found
            res.status(404).json({ message: 'No users found' });
            // console.log(user, users);
          }
        } else {
          // User not authenticated, send 401 Unauthorized response
          res.status(401).json({ message: 'Unauthorized access' });
        }
      } catch (error) {
        // Handle any server errors
        res.status(500).json({ message: 'Server error', error });
      }
};

// Controller to update the status of Users
exports.changeUserStatus = async (req, res) => {
  const { userId } = req.params;
  const { status } = req.body;

  // Define allowed status values
const validStatuses = ['active', 'restricted', 'banned'];

if (userId) {
  if (validStatuses.includes(status)) {
    try {
      // Update the user status in the database
      await User.findByIdAndUpdate(userId, { status });
      res.status(200).json({ message: 'Status updated successfully' });
    } catch (error) {
      // Handle errors during the update process
      res.status(500).json({ message: 'Error updating status', error });
    }
  } else {
    res.status(400).json({ message: `Invalid status value. Valid options are: ${validStatuses.join(', ')}` });
  }
} else {
  res.status(400).json({ message: 'userId is required' });
}

};

// Controller to verify the users 
exports.verifyUser = async (req, res) => {
  const { userId } = req.params;
  const { isVerified } = req.body;

  if(userId){
    try {
      // Update the isVerified field in the database
      await User.findByIdAndUpdate(userId, { isVerified });
      res.status(200).json({ message: 'User verification status updated successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error updating verification status', error });
    }
  }
  else{
    res.status(400).json({message: 'UserId not found for verifying user'});
  }
}

// Controller for fetching all orders
exports.fetchOrdersAll = async (req, res) => {
  try {
    
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized. No user found.',
      });
    }

    const userId = req.user.id;

    // Fetch the user by ID
    const user = await User.findById(userId);
    
    // Check if user exists and has admin role
    if (user && user.role === 'Admin') {

      const orders = await Order.find()
      .populate({
        path: 'products.product_id', // Populate product details
        populate: {
          path: 'userId', // Populate seller details from product's userId
          select: 'email role status isVerified profile.name profile.profilePicture profile.phone profile.addresses', // Selecting the seller's profile details
        },
      })
      .populate({
        path: 'buyer_id', // Populate buyer details
        select: 'email profile.name profile.profilePicture profile.addresses', // Selecting the buyer's profile details
      });

      return res.status(200).json({
        success: true,
        data: orders,
      });

    } else {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admins only.',
      });
    }

  } catch (error) {
    console.error('Error fetching orders:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};