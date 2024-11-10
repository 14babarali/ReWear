const mongoose = require('mongoose');

// Measurement schema to hold individual measurement details
const MeasurementSchema = new mongoose.Schema({
  category: { type: String, required: true }, // e.g., Male, Female
  productType: { type: String, required: true }, // e.g., Shirt
  fitType: { type: String, required: true }, // e.g., Slim Fit
  arms: { type: Number, required: true },
  chest: { type: Number, required: true },
  belly: { type: Number, required: true },
  neck: { type: Number, required: true },
  back: { type: Number, required: true },
  bicep: { type: Number, required: true },
  wrist: { type: Number, required: true },
  shirtLength: { type: Number, required: true }
});

// Main Order schema for tailor custom orders
const CustomOrderSchema = new mongoose.Schema({
  buyer: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }, // Reference to the buyer (User model)
  tailor: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }, // Reference to the tailor (User model)
  gig: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Gig', 
    required: true 
  }, // Reference to the specific Gig
  plan: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Plan', 
    required: true 
  }, // Reference to the selected plan within the Gig
  measurements: { 
    type: MeasurementSchema, 
    required: true 
  }, // Measurement details
  orderDescription: { 
    type: String, 
    required: true 
  }, // Description of the order
  orderDesign: { 
    type: String 
  }, // Additional design instructions (optional)
  status: { 
    type: String, 
    enum: ['pending', 'in progress', 'completed', 'cancelled'], 
    default: 'pending' 
  }, // Order status with default
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
}, { timestamps: true }); // Enable automatic timestamps for createdAt and updatedAt

// Export the CustomOrder model
module.exports = mongoose.model('TailorOrder', CustomOrderSchema);
