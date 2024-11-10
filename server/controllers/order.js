const Order =  require('../models/Order');
const Product = require('../models/Product'); // Adjust the path as needed
const Cart = require('../models/cart');

// Place an order
exports.placeOrder = async (req, res) => {
    const { products, type, address, phone } = req.body;
    const buyer_id = req.user.id;

    try {
        let orderResponses = [];

        // Iterate over each product to create individual orders
        for (const item of products) {
            const product = await Product.findById(item.product_id).exec();

            if (!product) {
                return res.status(404).json({ message: `Product not found: ${item.product_id}` });
            }

            if (product.qty < item.quantity) {
                return res.status(400).json({ message: `Not enough stock for product: ${item.product_id}` });
            }

            // Calculate the item price
            const itemPrice = product.price * item.quantity;
            const total_price = itemPrice + 200; // Add shipping cost

            // Create the order
            const newOrder = new Order({
                buyer_id: buyer_id,
                seller_id: product.userId, // Use the seller_id for the specific product
                products: [{
                    product_id: item.product_id,
                    productImage: product.images[0],
                    quantity: item.quantity,
                    size: item.size,
                    price: product.price
                }],
                type: type,
                total_price: total_price,
                address: { // Include the address
                  street: address.street,
                  city: address.city,
                  postalcode: address.postalcode
              },
              phone: phone
            });

            await newOrder.save();
            console.log(newOrder);
            // Update the product quantity
            product.qty -= item.quantity;
            await product.save(); // Save the updated product

            // Remove product from the user's cart
            await Cart.findOneAndUpdate(
                { userId: buyer_id },
                { $pull: { item: { productId: item.product_id } } }
            );

            // Store the order response
            orderResponses.push(newOrder);
        }

        res.status(201).json({ message: 'Orders placed successfully', orders: orderResponses });
    } catch (error) {
        console.error('Error placing orders:', error);
        res.status(500).json({ message: 'Error placing orders', error });
    }
};

// Function to fetch all orders for a specific user
exports.getOrdersByUser = async (req, res) => {
    try {
        const userId = req.user.id; 

        // Fetch all orders where the buyer_id matches the logged-in user
        const orders = await Order.find({ buyer_id: userId })
            .populate('products.product_id') // Populate product details
            .populate('buyer_id') // Populate buyer details

        if (orders.length === 0) {
            return res.status(404).json({ message: 'No orders found for this user' });
        }

        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders for user:', error);
        res.status(500).json({ message: 'Server error' });
    }
};



// {---Seller's order controller's ---}


// Get Orders with filtering and search
exports.getOrders = async (req, res) => {
    try {
      const { status, price, date, search } = req.query;
      const filters = {
        // Filter by user ID
        'products.userId': req.user.id
      };
  
      // Apply status filter
      if (status) filters.status = status;
  
      // Apply date filter
      const now = new Date();
      if (date === 'week') {
        const weekAgo = new Date(now.setDate(now.getDate() - 7));
        filters.created_at = { $gte: weekAgo };
      } else if (date === 'month') {
        const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
        filters.created_at = { $gte: monthAgo };
      } else if (date === 'year') {
        const yearAgo = new Date(now.setFullYear(now.getFullYear() - 1));
        filters.created_at = { $gte: yearAgo };
      }
  
      // Apply search filter for order ID, product name, or customer name
      if (search) {
        const searchRegex = new RegExp(search, 'i');
        filters.$or = [
          { _id: searchRegex },
          { 'buyer_id.name': searchRegex },
          { 'products.product_id.name': searchRegex },
        ];
      }
  
    let orders = await Order.find(filters)
    .populate('buyer_id', 'profile.name email') // Ensure this matches your User model
    .populate({
      path: 'products.product_id',
      select: 'name images', // Populate product name and images
    })
    .sort({ created_at: -1 });

    console.log("Orders after population:", orders);

         // Optionally include the buyer's name in each order object
         const ordersWithBuyerName = orders.map(order => {
          return {
              ...order._doc,
              buyerName: order.buyer_id ? order.buyer_id.name : 'Unknown', // Include buyer name
              products: order.products.map(product => ({
                ...product._doc,
                productName: product.product_id ? product.product_id.name : 'Unknown Product',
                productImages: product.product_id ? product.product_id.images : [], // Include images array
              })),
          };
      });

      // Apply price sorting
      if (price === 'low-to-high') {
          ordersWithBuyerName.sort((a, b) => a.total_price - b.total_price);
      } else if (price === 'high-to-low') {
          ordersWithBuyerName.sort((a, b) => b.total_price - a.total_price);
      }

      res.json(ordersWithBuyerName);
    } catch (err) {
      res.status(500).json({ error: 'Unable to fetch orders' });
    }
  };
  

 // Get Orders by Product User ID
exports.buyersOrders = async (req, res) => {
  try {
    // Fetch products owned by the seller (user)
    const products = await Product.find({ userId: req.user.id }).select('_id');

    // Check if the seller has any products
    if (!products.length) {
      return res.status(404).json({ message: 'No products found for this seller.' });
    }

    // Fetch orders that contain any of the seller's products
    const orders = await Order.find({
      'products.product_id': { $in: products.map(product => product._id) }
    })
      .populate({
        path: 'products.product_id', // Populate product details
        select: 'name images' // Select only necessary fields to avoid excess data
      })
      .populate({
        path: 'buyer_id', // Populate buyer details
        select: 'profile.name email' // Select only necessary buyer fields
      })
      .exec();

    if (!orders.length) {
      return res.status(404).json({ message: 'No orders found for your products.' });
    }

    // Send response with populated order details
    res.status(200).json(orders);
    console.log(JSON.stringify(orders, null, 2));
  } catch (err) {
    console.error('Error fetching seller orders:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// updating the order status 

exports.updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    await order.save();

    return res.status(200).json({ message: 'Order status updated successfully.' });
  } catch (error) {
    console.error('Error updating order status:', error);
    return res.status(500).json({ message: 'Server error. Could not update status.' });
  }
};


// Buyer Orders status for reviews button rendering

exports.checkProductInOrders = async (req, res) => {
  try {
    // Extract the current user's ID and productId from the request
    const userId = mongoose.Types.ObjectId(req.user.id);
    const productId = mongoose.Types.ObjectId(req.params);

    // Find orders for the current user containing the product with the specified productId
    const order = await Order.findOne({
      buyer_id: userId,
      'products.product_id': productId,
    });

    // If no order is found with the productId, return 404 response
    if (!order) {
      console.log('Product Not Found for Order: ',order);
      return res.status(404).json({ message: 'Product not found in any order for this user.' });
    }

    // Check if the order's status is 'delivered'
    if (order.status === 'delivered') {
      console.log('Review Button Available for Status: ',order.status);
      return res.status(200).json({ message: 'Product found in delivered order.' });
    } else {
      // Return a different response if the order exists but is not delivered
      console.log('Review Button Disabled for Status: ',order.status);
      return res.status(400).json({ message: 'Product found but order is not delivered.' });
    }
  } catch (error) {
    console.error(error);
    // Handle any unexpected errors
    return res.status(500).json({ message: 'Server error occurred.' });
  }
};