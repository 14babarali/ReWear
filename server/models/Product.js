const mongoose = require('mongoose');
const moment = require('moment-timezone');


const sizeSchema = new mongoose.Schema({
    size: { type: String, required: true }, // The size (e.g., S, M, L, XL)
    qty: { type: Number, required: true }   // The quantity available for that size
});


// Define schema for product
const productSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    type: { type: String, required: true },
    material: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    subcategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    subChildCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: false }, 
    sizes: { type: [sizeSchema], required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    condition: { type: Number},
    images: { type: [String], required: true },
    created_at: { type: Date, default: () => moment().tz('Asia/Karachi').toDate() },
    updated_at: { type: Date, default: () => moment().tz('Asia/Karachi').toDate() }
});

// Create a model based on schema
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
