const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Schema Definition
const EmailVerificationTokenSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    expires: 3600, // 1 hour expiration
    default: Date.now,
  },
});

// Hash the OTP before saving it
EmailVerificationTokenSchema.pre('save', async function (next) {
  if (this.isModified('token')) {
    this.token = await bcrypt.hash(this.token, 10);
  }
  next();
});

// Method to compare token
EmailVerificationTokenSchema.methods.compareToken = async function (inputToken) {
  return await bcrypt.compare(inputToken, this.token);
};

// Export the model
module.exports = mongoose.model('EmailVerificationToken', EmailVerificationTokenSchema);
