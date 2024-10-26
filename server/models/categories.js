const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: '', // Optional description of the category
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the parent category
        ref: 'Category',
        default: null, // Allows for subcategories
    },
     userId: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the user who created the category
        ref: 'User',
        required: true,
    },
    isDeleted: {
        type: Boolean,
        default: false, // Soft delete field
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// Create a model based on schema
const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
