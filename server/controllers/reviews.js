const Reviews = require('../models/Reviews'); // Import the Reviews model
const Product = require('../models/Product');

// Create a new review
const createReview = async (req, res) => {
    try {
        const { product_id, rating, comment } = req.body;
        const reviewer_id = req.user.id; // Extract the logged-in user's ID (reviewer_id)

        // Fetch the product by its ID to get the user who added it
        const product = await Product.findById(product_id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        const reviewee_id = product.userId; // userId is the seller who added the product

        // Validate that all required fields are present
        if (!reviewer_id || !reviewee_id || !product_id || !rating) {
            return res.status(400).json({ message: "Missing required fields." });
        }

        // Create a new review
        const newReview = new Reviews({
            reviewer_id,
            reviewee_id,
            product_id,
            rating,
            comment
        });

        // Save the review to the database
        await newReview.save();

        return res.status(201).json({ message: "Review submitted successfully.", review: newReview });
    } catch (error) {
        console.error('Error creating review:', error);
        return res.status(500).json({ message: "Server error. Could not submit review." });
    }
};

// Get reviews for a product
const getProductReviews = async (req, res) => {
    try {
        const { productId } = req.params;

        // Find reviews for the given product
        const reviews = await Reviews.find({ product_id: productId }).populate('req.user.id', 'req.user.name');

        return res.status(200).json(reviews);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        return res.status(500).json({ message: "Server error. Could not fetch reviews." });
    }
};

module.exports = { createReview, getProductReviews };
