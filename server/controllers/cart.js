const User = require('../models/User');
const Product = require('../models/Product');
const Cart = require('../models/cart');

exports.addToCart = async (req, res) => {
    const { productId } = req.body;
    const userId = req.user.id;

    try {
        const user = await User.findById(userId).populate('cart');
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        let cart;

        // Check if the user has a cart
        if (!user.cart) {
            // Create a new cart if the user doesn't have one
            cart = new Cart({ userId, item: [{ productId, quantity: 1 }] });
            await cart.save();
            user.cart = cart._id;
            await user.save();
        } else {
            // Get the existing cart
            cart = await Cart.findById(user.cart._id);

            // Check if the product already exists in the cart
            const existingCartItem = cart.item.find(item => item.productId.toString() === productId);

            if (existingCartItem) {
                return res.status(400).json({ message: 'Product already exists in cart' });
            } else {
                // If the product does not exist, add it to the cart
                cart.item.push({ productId, quantity: 1 });
                await cart.save();
            }
        }

        // Populate the 'item.productId' field to get the updated cart details
        const updatedCart = await Cart.findById(cart._id).populate('item.productId');
        res.status(200).json({ cart: updatedCart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};
  
exports.getCart = async (req, res) => {
    const userId = req.user.id;

    try {
        if(userId){
        const user = await User.findById(userId).populate({
            path: 'cart',
            populate: {
                path: 'item.productId',
                model: 'Product'
            }
        });

        if (!user.cart || !user.cart.item || user.cart.item.length === 0) {
            return res.status(200).json({ products: [] }); // Return empty array if no items in the cart
        }

        // Extract the required fields from the products in the cart
        const products = user.cart.item.map(cartItem => {
            const product = cartItem.productId;
            return {
                id: product.id,
                name: product.name,
                price: product.price,
                size: product.size || '',  // size from product object
                qty: product.qty,
                images: product.images || [],  // Ensure this is always an array
                quantity: cartItem.quantity  // Quantity from the cartItem
            };
        });
        

        res.status(200).json({ products });
        }
        else{
            res.status(404).json({message: 'UserId Not Found'});
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

exports.getcartproducts = async (req,res) => {
    try {
        const userId = req.user.id; // Get user ID from request
        const user = await User.findById(userId).populate({
            path: 'cart',
            populate: {
                path: 'item.productId',
                model: 'Product'
            }
        });

        if (!user || !user.cart || !user.cart.item) {
            return res.status(404).json({ message: 'Cart or cart items not found' });
        }

        // Get the selected product IDs from the request
        const selectedItemIds = Object.keys(req.query);

        // Filter items based on selected IDs
        const selectedItems = user.cart.item.filter(item => selectedItemIds.includes(item.productId._id.toString()));

        // Map the selected items to include product details
        const result = selectedItems.map(item => ({
            product: item.productId,
            quantity: item.quantity
        }));

        res.json(result);
    } catch (error) {
        console.error('Error in getCartProducts:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.qtyupdate = async (req,res) => {
    const { productId, quantity } = req.body;
    const userId = req.user.id; // Assuming req.user contains user info from authentication middleware
  
    try {
      const cart = await Cart.findOne({ userId });
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found.' });
      }

      const product = await Product.findById(productId);
    if (!product) {
    return res.status(404).json({ message: 'Product not found.' });
    }

    if (quantity > product.qty || quantity < 1) {
    return res.status(300).json({ message: 'Quantity exceeds available stock.' });
    }
  
      const itemIndex = cart.item.findIndex(item => item.productId.toString() === productId);
      if (itemIndex === -1) {
        return res.status(404).json({ message: 'Item not found in cart.' });
      }
  
      // Update quantity
      cart.item[itemIndex].quantity = quantity;
      await cart.save();
  
      res.status(200).json({ message: 'Cart item updated successfully.' });
    } catch (error) {
      console.error('Error updating cart item:', error);
      res.status(500).json({ message: 'Internal Server Error.' });
    }  
};

// Delete a product from the cart
exports.deleteCartItem = async (req, res) => {
    try {
        const userId = req.user.id;
        const productId = req.params.productId;
    
        // Find the user's cart
        let cart = await Cart.findOne({ userId });
        if (!cart) {
          return res.status(404).json({ message: 'Cart not found' });
        }
    
        // Remove the product from the cart
        cart.item = cart.item.filter(item => item.productId.toString() !== productId);
    
        // Save the updated cart
        await cart.save();
    
        res.status(200).json({ message: 'Product removed from cart' });
      } catch (error) {
        console.error('Error deleting product from cart:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
};