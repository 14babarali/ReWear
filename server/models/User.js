const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const userSchema = new mongoose.Schema({
  email: { 
    type: String, required: true, unique: true },
  password: { 
    type: String, required: true },
  role: { 
    type: String, 
    enum: ['Buyer', 'Seller', 'Tailor'], 
    default: 'Buyer' 
  },
  profile: {
    name: { type: String },
    phone: { type: String },
    addresses: [{
      street: { type: String },
      city: { type: String },
      postalcode: { type: String } // Changed to String for flexibility
    }],
    profilePicture: { 
      type: String, 
      default: null // Default value for profile picture
    },
    cnicfront:{
      type: String, 
      default: null // Default value for cnicfront
    },
    cnicback:{
      type: String,
      default: null // Default value for cnicback
    }

  },
  isVerified: { type: Boolean, default: false },
  status: { 
    type: String, 
    default: 'active' 
  },
  cart: { 
    type: mongoose.Schema.Types.ObjectId, ref: 'Cart' 
  },
  created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

// Generate JWT token method
userSchema.methods.generateToken = function() {
  // Ensure you have a secure and unique secret key
  const token = jwt.sign({ id: this._id },  process.env.JWT_SECRET, { expiresIn: '1h' });
  return token;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
