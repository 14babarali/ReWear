const mongoose = require('mongoose');

const GigSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, maxlength: 100 },
  description: { type: String, required: true },
  gigImage: { type: String, required: true },

  // Tailoring-specific details
  serviceType: {
    type: String,
    required: true,
    enum: [
        'Custom Suit',
        'Alteration',
        'Bespoke Jacket',
        'Dressmaking',
        'Waist-Coat',
        'Leather Jacket',
        'Leather Shoes',
        'Sherwani',
        'Bridal-Dress',
        'Other'
    ],
  },
  fabricType: {
    type: String,
    required: true,
    enum: ['Cotton', 'Wool', 'Linen', 'Silk', 'Synthetic', 'Leather', 'Other'],
  },
  measurementsRequired: { type: Boolean, default: true },
  measurementInstructions: { type: String, default: "Please provide measurements in inches or centimeters." },

  // Pricing and delivery for basic and premium services
  basicPrice: { type: Number, required: true, min: 1000, max: 3000 },
  premiumPrice: {
    type: Number,
    required: true,
    min: 3000,
    max: 10000,
    validate: {
      validator: function (value) { return value > this.basicPrice; },
      message: 'Premium price must be higher than basic price',
    }
  },
  
  // Regular delivery time for basic service
  basicDeliveryDays: { type: Number, required: true, default: 14 },  // Regular delivery time for basic
  
  // Custom delivery time for premium, with a valid range
  premiumDeliveryDays: {
    type: Number,
    min: 5,
    max: 30,  // or any custom range that suits your business logic
    required: false,
  },

  // Reviews and ratings
  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviews: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      comment: String,
      rating: { type: Number, min: 0, max: 5 },
      createdAt: { type: Date, default: Date.now },
    }
  ],

  status: { type: String, enum: ['active', 'paused', 'deleted'], default: 'active' },
}, { timestamps: true });

GigSchema.virtual('averageRating').get(function() {
  if (this.reviews.length > 0) {
    const total = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    return (total / this.reviews.length).toFixed(2);
  }
  return 0;
});

module.exports = mongoose.model('Gig', GigSchema);
