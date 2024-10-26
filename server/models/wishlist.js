const mongoose = require('mongoose');

// Define schema for WishlistItem
const wishlistItemSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // User who has the product in their wishlist
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true } // The product in the wishlist
});

const Wishlist = mongoose.model('Wishlist', wishlistItemSchema);

module.exports =  Wishlist;