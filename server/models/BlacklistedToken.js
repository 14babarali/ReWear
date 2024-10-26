const mongoose = require('mongoose');

const BlacklistedTokenSchema = new mongoose.Schema({
  token: { 
    type: String, 
    required: true, 
    unique: true },

  createdAt: { 
    type: Date, 
    default: Date.now, expires: '7d',
    required: true
   } // Automatically remove after 7 days
});

module.exports = mongoose.model('BlacklistedToken', BlacklistedTokenSchema);
