const express = require('express');
const router = express.Router();
const userAdmin = require('../controllers/userAdmin');
const authMiddleware = require('../middleware/authMiddleware');

// Route for fetching all users for admin only....
router.get('/allusers', authMiddleware.verifyToken, userAdmin.getAllNonAdminUsers);

// Route for changing the status of the Users....
router.put('/users/:userId/status',authMiddleware.verifyToken, userAdmin.changeUserStatus);

// Route for changing the status of the Users....
router.put('/users/:userId/verify',authMiddleware.verifyToken, userAdmin.verifyUser);

// Route for fetching all orders of the Users....
router.get('/orders/all', authMiddleware.verifyToken, userAdmin.fetchOrdersAll);

module.exports = router;