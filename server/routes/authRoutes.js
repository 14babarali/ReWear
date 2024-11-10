const express = require('express');
const router = express.Router();
const cart = require('../controllers/cart');
const authMiddleware = require('../middleware/authMiddleware');
const authController = require('../controllers/authController');
const product = require('../controllers/product');
const wishlist = require('../controllers/wishlist');
const order = require('../controllers/order');
const reviews = require('../controllers/reviews');

const upload = require('../middleware/multer');

// POST /api/register
router.post('/register', authController.register);

// POST /api/login
router.post('/login', authController.login);

// POST /api/logout
router.post('/logout', authController.logout);

// Route to update user profile
router.put('/editprofile', authMiddleware.verifyToken, upload.fields([
    { name: 'profilePicture', maxCount: 1 },
    { name: 'cnicfront', maxCount: 1 },
    { name: 'cnicback', maxCount: 1 }
  ]), authController.updateUserProfile);

// Change Password
router.post('/changepassword', authMiddleware.verifyToken, authController.changePassword);

// Validating the user token 
router.post('/validateUser', authController.validateUser);

//verifying the OTP
router.post("/verify_otp", authController.verifyOTP); 

// Upload/Add New Product
router.post('/uploadproduct', authMiddleware.verifyToken,upload.array('images'), product.upload);

// Fetching Products 
router.get('/fetchproducts', authMiddleware.verifyToken, product.fetch);

// Edit product and save
router.put('/editproduct/:id', authMiddleware.verifyToken,upload.array('images'), product.edit);

// Delete Product
router.delete('/products/:id', authMiddleware.verifyToken, product.delete);

// Get Product by ID
router.get('/product/:id', product.getProductsById);

// Route for fetching all products
router.get('/featured_products',authMiddleware.verifyToken, product.fetchall);


// Fetch Products by Category
router.post('/category/item', product.getProductsByCategory);

// Fetch Products by type 
router.get('/products/:category', product.getProductsByCategory);

// Fetch Products for shoes
router.get('/shoes',authMiddleware.verifyToken, product.fetchShoes);


// Dynamic Category products fetching 

router.get('/dynamic/:categoryId', product.categoryProducts);


// For adding Products to Wishlist
router.post('/wishlist', authMiddleware.verifyToken, wishlist.wishlist);

// For Checking the Status of Wishlisted Product
router.get('/wishlist/:id',authMiddleware.verifyToken, wishlist.checkWishlistStatus);

// For fetching all wishlist items
router.get('/wishlist-items', authMiddleware.verifyToken, wishlist.fetchwishlist);



// Cart Products 

router.post('/cart', authMiddleware.verifyToken, cart.addToCart);
router.get('/cartitems', authMiddleware.verifyToken, cart.getCart);

// getcartproductsById
router.get ('/cartproduct/:id', authMiddleware.verifyToken, product.getcartproductsById);

// update the quantity of products in cart 
router.put ('/qtyupdated', authMiddleware.verifyToken, cart.qtyupdate);

// update size for product in cart
// router.put('/changesize',authMiddleware.verifyToken, cart.updateCartItemSize);

// DELETE route to remove a product from the cart
router.delete('/deletecartitem/:productId', authMiddleware.verifyToken, cart.deleteCartItem);

// fetching products from cart in checkout page 
router.get('/cartproducts', authMiddleware.verifyToken, cart.getcartproducts);



//order routes 

router.post('/orderplace', authMiddleware.verifyToken, order.placeOrder);

router.get('/orders', authMiddleware.verifyToken, order.getOrdersByUser);

// Review Button Rendering for Buyer componet/ProductPage.js
router.get('/review_order_status',authMiddleware.verifyToken, order.checkProductInOrders);

// Seller's Routes for orders management

// GET Orders with filtering and search
router.get('/seller_orders',authMiddleware.verifyToken, order.getOrders);

// GET Orders for logged In User
router.get('/fetchorders',authMiddleware.verifyToken, order.buyersOrders);

// PUT Update order status
// router.put('/orders/:orderId/status', authMiddleware.verifyToken, order.updateOrderStatus);



                      // Reviews  for products 
router.post('/addreviews',authMiddleware.verifyToken, reviews.createReview); // Route to add a review
router.get('/:productId/reviews', reviews.getProductReviews);
 // Route to get reviews for a specific product

                      // Seller orders status updation routes
router.patch('/orders/:orderId/status', authMiddleware.verifyToken, order.updateOrderStatus);

module.exports = router;
