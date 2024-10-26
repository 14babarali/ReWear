const express = require('express');
const router = express.Router();
const cart = require('../controllers/cart');
const authmiddleware = require('../middleware/authMiddleware');
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
router.post('/logout', authmiddleware.verifyToken, authController.logout);

// Route to update user profile
router.put('/editprofile', authmiddleware.verifyToken, upload.fields([
    { name: 'profilePicture', maxCount: 1 },
    { name: 'cnicfront', maxCount: 1 },
    { name: 'cnicback', maxCount: 1 }
  ]), authController.updateUserProfile);

// Change Password
router.post('/changepassword', authmiddleware.verifyToken, authController.changePassword);

// Validating the user token 
router.post('/validateUser', authController.validateUser);

//verifying the OTP
router.post("/verify_otp", authController.verifyOTP); 

// Upload/Add New Product
router.post('/uploadproduct', authmiddleware.verifyToken,upload.array('images'), product.upload);

// Edit product and save
router.put('/editproduct/:id', authmiddleware.verifyToken,upload.array('images'), product.edit);

// Get Product by ID
router.get('/product/:id', product.getProductsById);

// Fetching Products 
router.get('/fetchproducts', authmiddleware.verifyToken, product.fetch);

// Route for fetching all products
router.get('/featured_products',authmiddleware.verifyToken, product.fetchall);

// Delete Product
router.delete('/products/:id', authmiddleware.verifyToken, product.delete);

// Fetch Products by Category
router.post('/category/item', product.getProductsByCategory);

// Fetch Products by type 
router.get('/products/:category', product.getProductsByCategory);

// Fetch Products for shoes
router.get('/shoes',authmiddleware.verifyToken, product.fetchShoes);


// Dynamic Category products fetching 

router.get('/dynamic/:categoryId', product.categoryProducts);


// For adding Products to Wishlist
router.post('/wishlist', authmiddleware.verifyToken, wishlist.wishlist);

// For Checking the Status of Wishlisted Product
router.get('/wishlist/:id',authmiddleware.verifyToken, wishlist.checkWishlistStatus);

// For fetching all wishlist items
router.get('/wishlist-items', authmiddleware.verifyToken, wishlist.fetchwishlist);



// Cart Products 

router.post('/cart', authmiddleware.verifyToken, cart.addToCart);
router.get('/cartitems', authmiddleware.verifyToken, cart.getCart);

// getcartproductsById
router.get ('/cartproduct/:id', authmiddleware.verifyToken, product.getcartproductsById);

// update the quantity of products in cart 
router.put ('/qtyupdated', authmiddleware.verifyToken, cart.qtyupdate);

// DELETE route to remove a product from the cart
router.delete('/deletecartitem/:productId', authmiddleware.verifyToken, cart.deleteCartItem);

// fetching products from cart in checkout page 
router.get('/cartproducts', authmiddleware.verifyToken, cart.getcartproducts);


//order routes 

router.post('/orderplace', authmiddleware.verifyToken, order.placeOrder);

router.get('/orders', authmiddleware.verifyToken, order.getOrdersByUser);


// Seller's Routes for orders management

// GET Orders with filtering and search
router.get('/seller_orders',authmiddleware.verifyToken, order.getOrders);

// GET Orders for logged In User
router.get('/fetchorders',authmiddleware.verifyToken, order.buyersOrders);

// PUT Update order status
// router.put('/orders/:orderId/status', authmiddleware.verifyToken, order.updateOrderStatus);


// Reviews  for products 
router.post('/addreviews',authmiddleware.verifyToken, reviews.createReview); // Route to add a review

// Route to get reviews for a specific product
router.get('/:productId/reviews', reviews.getProductReviews);

// Seller orders status updation routes
router.patch('/orders/:orderId/status', authmiddleware.verifyToken, order.updateOrderStatus);

module.exports = router;
