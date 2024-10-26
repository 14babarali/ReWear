const mongoose = require('mongoose');

const GigSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  gigImage: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  skills: {
    type: [String],
    required: true,
    validate: [skillsLimit, 'You can only add up to 3 skills'],
  },
  basicPrice: {
    type: Number,
    required: true,
    min: 1000,
    max: 3000,
  },
  premiumPrice: {
    type: Number,
    required: true,
    min: 3000,
    max: 10000,
  },
});

function skillsLimit(val) {
  return val.length <= 3;
}

module.exports = mongoose.model('Gig', GigSchema);
