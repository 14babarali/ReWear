const mongoose = require('mongoose');

// Defining schema for CartItem
const cartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    item: [
        {
          productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
          quantity: { type: Number, default: 1 },
          size: { type: String }
        },
      ],
});

// Creating a model based on schema
const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
