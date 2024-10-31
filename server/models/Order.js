const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    buyer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [{
      product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true },
      size: { type: String, required: true },
      price: { type: Number, required: true } // Price of each product
  }],
    type: { type: String, default: null },
    total_price: { type: Number, required: true },
    status: { type: String, default: 'pending' },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    // Address field to match the User model's structure
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      postalcode: { type: String, required: true } // Keep it consistent with User model
  },
  phone: { type: String, required: true }
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
