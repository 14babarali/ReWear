const Reviews = require("../models/Reviews"); // Import the Reviews model
const Product = require("../models/Product");
const User = require("../models/User");

// Create a new review
exports.createReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    const reviewer_id = req.user.id; // Extract the logged-in user's ID (reviewer_id)

    console.log(productId);

    // Fetch the product by its ID to get the user who added it
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    const reviewee_id = product.userId; // userId is the seller who added the product

    const imagePaths = req.files ? req.files.map((file) => file.filename) : [];

    // Validate that all required fields are present
    if (
      !reviewer_id ||
      !reviewee_id ||
      !productId ||
      !rating ||
      !comment ||
      !imagePaths
    ) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // Create a new review object
    const newReview = new Reviews({
      reviewer_id,
      reviewee_id,
      product_id: productId,
      rating,
      comment,
      images: imagePaths,
    });

    // Save the review to the database
    await newReview.save();

    return res
      .status(201)
      .json({ message: "Review submitted successfully.", review: newReview });
  } catch (error) {
    console.error("Error creating review:", error);
    return res
      .status(500)
      .json({ message: "Server error. Could not submit review." });
  }
};

// Get reviews for a product
exports.getProductReviews = async (req, res) => {
  try {
    const { id } = req.params;
    // console.log(id);

    // Find reviews for the given product
    const reviews = await Reviews.find({ product_id: id }).populate(
      "reviewer_id",
      "profile.name profile.profilePicture created_at"
    ); // Corrected populate syntax

    if (!reviews) {
      return res
        .status(404)
        .json({ message: "Reviews Not found for this Product" });
    }
    // console.log(reviews);
    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return res
      .status(500)
      .json({ message: "Server error. Could not fetch reviews." });
  }
};

// Get reviews for user-specific products
exports.getUserProductReviews = async (req, res) => {
  try {
    const { id: productId } = req.params; // Product ID from the request parameters
    const userId = req.user.id; // Logged-in user's ID

    // Verify if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    // Check if the product belongs to the logged-in user
    const product = await Product.findOne({ _id: productId, userId: userId });
    if (!product) {
      return res
        .status(403)
        .json({
          message: "You do not have access to reviews for this product.",
        });
    }

    // Find reviews for the specific product
    const reviews = await Reviews.find({ product_id: productId }).populate(
      "reviewer_id",
      "profile.name profile.profilePicture created_at"
    );

    // If no reviews are found
    if (!reviews || reviews.length === 0) {
      return res
        .status(404)
        .json({ message: "No reviews found for this product." });
    }

    // Return the reviews
    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Server error. Could not fetch reviews." });
  }
};

// Get All Reviews of Seller Products
exports.getAllReviews = async (req, res) => {
  try {
    const userId = req.user.id; // Retrieve user ID from request
    const user = await User.findById(userId);
    let reviews;

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    if (user.role === "Admin") {
      // If the user is an Admin, fetch all reviews
      reviews = await Reviews.find()
        .populate("reviewer_id") // Populate reviewer details
        .populate("reviewee_id") // Populate reviewee details
        .populate("product_id") // Populate product details
        .exec();
    } else if (user.role === "Seller") {
      const sellerId = userId; // Use user ID for non-admin roles

      // Fetch all reviews where reviewee_id matches the seller's ID
      reviews = await Reviews.find({ reviewee_id: sellerId })
        .populate("reviewer_id") // Populate reviewer details
        .populate("reviewee_id") // Populate reviewee details
        .populate("product_id")
        .exec();
    } else {
      // Optionally handle cases for Buyers or other roles if necessary
      return res.status(403).json({
        error:
          "Access denied. You do not have permission to view reviews for this role.",
      });
    }

    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: "An error occurred while fetching reviews" });
  }
};
