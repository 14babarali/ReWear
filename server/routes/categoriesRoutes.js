const express = require('express');
const router = express.Router();
const authmiddleware = require('../middleware/authMiddleware');
const { createCategory, getUserCategories, deleteCategory, updateCategory, getBuyerCategories } = require('../controllers/categoryController');

router.post('/create_new', authmiddleware.verifyToken, createCategory);
router.get('/all', authmiddleware.verifyToken, getUserCategories);
router.get('/buyers',getBuyerCategories);
router.delete('/:categoryId', authmiddleware.verifyToken, deleteCategory);
router.put('/:categoryId', authmiddleware.verifyToken, updateCategory);

module.exports = router;
