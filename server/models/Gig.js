const mongoose = require('mongoose');

const GigSchema = new mongoose.Schema({
  // Main gig details
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, maxlength: 100 },
  description: { type: String, required: true },
  gigImage: { type: String, required: true },
  portfolioImages: [{ type: String }],

  // Tailoring services details
  serviceType: { type: String, required: true },  // Simplified to allow any string
  fabricType: { type: String, required: true },   // Simplified to allow any string
  measurementsRequired: { type: Boolean, default: true },
  experienceYears: { type: Number, required: true, min: 0, default: 1 },
  measurementInstructions: { 
    type: String, 
    default: "Provide measurements in inches or centimeters." 
  },

  // Pricing and delivery
  basicPrice: { type: Number, required: true, min: 1000 },
  premiumPrice: {
    type: Number,
    required: true,
    validate: {
      validator: function (value) { return value > this.basicPrice; },
      message: 'Premium price must be higher than basic price',
    }
  },
  basicDeliveryDays: { type: Number, required: true, default: 14 },
  premiumDeliveryDays: { type: Number, min: 5, max: 30 },

  // Reviews
  reviews: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      comment: String,
      rating: { type: Number,default: 0, min: 0, max: 5 },
      createdAt: { type: Date, default: Date.now },
    }
  ],

  // Status
  status: { type: String, enum: ['active', 'paused', 'deleted'], default: 'active' },
  
}, { timestamps: true });

// Virtual field for calculating average rating
GigSchema.virtual('averageRating').get(function() {
  if (this.reviews.length > 0) {
    const totalRating = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    return (totalRating / this.reviews.length).toFixed(2);
  }
  return 0;
});

module.exports = mongoose.model('Gig', GigSchema);
