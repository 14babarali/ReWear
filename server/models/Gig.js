const mongoose = require('mongoose');

// Media schema to hold individual media items
const MediaItemSchema = new mongoose.Schema({
  type: { type: String, enum: ['image', 'video'], required: true },
  url: { type: String, required: true },
});

// Collection schema to hold collections of media items
const CollectionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String, required: true }, // Main image for the collection
  items: [MediaItemSchema], // Array to hold media items (images/videos)
});

// Plan schema to hold pricing plans for a gig
const PlanSchema = new mongoose.Schema({
  name: {  type: String,
  enum: ['Basic', 'Premium'],default: 'Basic'}, // Name of the plan (e.g., Basic, Premium)
  price: { type: Number, required: true }, // Price of the plan
  deliveryDays: { type: Number, required: true }, // Delivery days associated with the plan
});

// Gig schema to hold all relevant gig information
const GigSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId,
     ref: 'User',
     required: true 
    },
  title: { type: String, required: true, maxlength: 60 },
  description: { type: String, required: true },
  services: [
    { 
      type: String, 
      required: true 
    } 
  ],
  
  experience: { type: Number, min:2, max:100, required: true },
  gigImage: { type: String, required: true },
  collections: [CollectionSchema], // Array of collections for media uploads
  plans: [PlanSchema], // Pricing plans for the gig
  status: { type: String, enum: ['active', 'paused', 'deleted'], default: 'active' },
}, { timestamps: true });

module.exports = mongoose.model('Gig', GigSchema);
